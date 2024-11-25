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
  const { name, bio, avatar } = await req.json();

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
      'INSERT INTO authors ("userId", name, bio, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, bio, avatar]
    );

    return NextResponse.json({ success: true, author: authorResult.rows[0] });
  } finally {
    client.release();
  }
}