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
      'SELECT name, bio FROM authors WHERE id = $1',
      [authorId]
    );

    const author_url = `${process.env.NEXT_PUBLIC_APP_URL}/a/${authorId}`;

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
