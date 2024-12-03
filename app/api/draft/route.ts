import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pool } from '@/lib/db' 

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { user } = session;
  const { status, title, subtitle, content, history, authorId } = await req.json();

  if (!user || !user.name) {
    return NextResponse.json({ success: false, message: "Invalid user" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const userResult = await client.query('SELECT id FROM users WHERE name = $1', [user.name]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = userResult.rows[0].id;
    const history0 = history || { history: null };

    const draftResult = await client.query(
      'INSERT INTO drafts ("userId", status, title, subtitle, content, history, "authorId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, 'editing', title, subtitle, content, history0, authorId]
    );

    const draft = draftResult.rows[0];

    return NextResponse.json({ success: true, draft });
  } finally {
    client.release();
  }
}
