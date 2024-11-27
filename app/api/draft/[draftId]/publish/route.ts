import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pool } from '@/lib/db'
import { verifyCloudProof, IVerifyResponse, ISuccessResult, VerificationLevel } from '@worldcoin/minikit-js'
import { isJsonEqual, sortAndStringifyJson } from '@/lib/json';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { user } = session;
  const fullPayload = await req.json();
  const { draftId } = await params;

  if (!user || !user.name) {
    return NextResponse.json({ success: false, message: "Invalid user" }, { status: 401 });
  }

  const { publication, verification } = fullPayload;
  const { publication_title, publication_subtitle, publication_content, publication_date, author_id_libro } = publication;

  const signal = sortAndStringifyJson(publication);

  console.log('Signal', signal);

  const proof: ISuccessResult = {
    proof: verification.proof,
    merkle_root: verification.merkle_root,
    nullifier_hash: verification.nullifier_hash,
    verification_level: VerificationLevel.Orb,
  };

  // verify the proof
  const verifyRes = (await verifyCloudProof(
    proof,
    process.env.APP_ID as `app_${string}`,
    'written-by-a-human',
    signal,
  )) as IVerifyResponse

  if(!verifyRes.success) {
    console.log('Invalid proof', verifyRes);
    return NextResponse.json({ success: false, message: "Invalid proof" }, { status: 400 });
  }

  const client = await pool.connect();

  // Check that the draft belongs to the user
  const userResult = await client.query(
    'SELECT id FROM users WHERE name = $1',
    [user.name]
  );

  if (userResult.rows.length === 0) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  const userId = userResult.rows[0].id;

  const draftResult = await client.query(
    'SELECT * FROM drafts WHERE "id" = $1 AND "userId" = $2',
    [draftId, userId]
  );

  if (draftResult.rows.length === 0) {
    return NextResponse.json({ success: false, message: "Draft not found or does not belong to the user" }, { status: 404 });
  }

  const draft = draftResult.rows[0];

  // Consolidated check for title, subtitle, and content
  if (
    draft.title !== publication_title || 
    draft.subtitle !== publication_subtitle || 
    !isJsonEqual(draft.content, publication_content)
  ) {
    return NextResponse.json({ success: false, message: "Title, subtitle, or content does not match the draft" }, { status: 400 });
  }

  // Check that the title is more than 5 characters
  if (publication_title.length < 5) {
    return NextResponse.json({ success: false, message: "Title is too short" }, { status: 400 });
  }

  // Check that the date is not in the future and not 5 mins older than the current date and time
  const publicationDate = new Date(publication_date);
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  if (publicationDate > now || publicationDate < fiveMinutesAgo) {
    return NextResponse.json({ success: false, message: "Invalid publication date" }, { status: 400 });
  }

  // Check that the author belongs to the user
  const authorResult = await client.query(
    'SELECT * FROM authors WHERE "id" = $1 AND "userId" = $2',
    [author_id_libro, userId]
  );

  if (authorResult.rows.length === 0) {
    return NextResponse.json({ success: false, message: "Author not found or does not belong to the user" }, { status: 404 });
  }
  
  try {
    // Begin transaction
    await client.query('BEGIN');

    const version = '1';
    // Create article
    const articleResult = await client.query(
      'INSERT INTO publications ("userId", "authorId", proof, signal, content, version) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, author_id_libro, proof, signal, draft.content, version]
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
      publicationId: articleResult.rows[0].id
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