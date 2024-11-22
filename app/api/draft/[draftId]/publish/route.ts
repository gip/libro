import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pool } from '@/lib/db'

const sign = async (draftId: string) => {
  return '1234';
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { user } = session;
  console.log('PAR', await params);
  const { draftId } = await params;

  if (!user || !user.name) {
    return NextResponse.json({ success: false, message: "Invalid user" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Get user ID
    const userResult = await client.query('SELECT id FROM users WHERE name = $1', [user.name]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const userId = userResult.rows[0].id;

    console.log('draftId', draftId, userId);
    // Get draft
    const draftResult = await client.query(
      'SELECT * FROM drafts WHERE "id" = $1 AND "userId" = $2',
      [draftId, userId]
    );

    if (draftResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Draft not found" }, { status: 404 });
    }

    const draft = draftResult.rows[0];

    // Generate proof using sign function
    const proof = await sign(draftId);

    // Create document
    const documentResult = await client.query(
      'INSERT INTO documents ("userId", proof, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, proof, draft.title, draft.content]
    );

    // Update draft status to published
    await client.query(
      'UPDATE drafts SET status = $1 WHERE id = $2',
      ['published', draftId]
    );

    // Commit transaction
    await client.query('COMMIT');

    return NextResponse.json({ 
      success: true, 
      document: documentResult.rows[0]
    });
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    return NextResponse.json({ 
      success: false, 
      message: "Failed to publish draft",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    client.release();
  }
} 