import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pool } from '@/lib/db' 

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { user } = session;

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

    const authorsResult = await client.query(
      'SELECT * FROM authors WHERE "userId" = $1',
      [userId]
    );

    const authors = authorsResult.rows;

    return NextResponse.json({ success: true, authors });
  } finally {
    client.release();
  }
}
