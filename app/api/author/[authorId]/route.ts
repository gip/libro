import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pool } from '@/lib/db'

export async function GET(req: NextRequest, context: { params: Promise<{ authorId: string }> }): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const { authorId } = await context.params;

  if (!authorId) {
    return NextResponse.json({ success: false, message: "Author ID is required" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const authorResult = await client.query(
      'SELECT * FROM authors WHERE id = $1',
      [authorId]
    );

    if (authorResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Author not found" }, { status: 404 });
    }

    const author = authorResult.rows[0];
    let self = false;
    if (session && session.user) {
      const userResult = await client.query('SELECT id FROM users WHERE name = $1', [session.user.name]);
      const userId = userResult.rows.length > 0 ? userResult.rows[0].id : null;
      self = userId === author.userId;
    }

    return NextResponse.json({ success: true, author, self });
  } finally {
    client.release();
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ authorId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { user } = session;
  const { name, bio, avatar } = await req.json();
  const { authorId } = await context.params;

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

    const authorResult = await client.query(
      'UPDATE authors SET name = $1, bio = $2, avatar = $3 WHERE id = $4 AND "userId" = $5 RETURNING *',
      [name, bio, avatar, authorId, userId]
    );

    if (authorResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Author not found or you don't have permission" }, { status: 404 });
    }

    return NextResponse.json({ success: true, author: authorResult.rows[0] });
  } finally {
    client.release();
  }
}
