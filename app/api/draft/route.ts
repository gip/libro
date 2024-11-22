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
  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get('id');

  if (!user || !user.name) {
    return NextResponse.json({ success: false, message: "Invalid user" }, { status: 401 });
  }

  if (!draftId) {
    return NextResponse.json({ success: false, message: "Draft ID is required" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const userResult = await client.query('SELECT id FROM users WHERE name = $1', [user.name]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    const draftResult = await client.query(
      'SELECT * FROM drafts WHERE "userId" = $1 AND id = $2 AND status = $3',
      [userId, draftId, 'editing']
    );

    if (draftResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Draft not found or not in editing status" }, { status: 404 });
    }

    const draft = draftResult.rows[0];

    return NextResponse.json({ success: true, data: draft });
  } finally {
    client.release();
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { user } = session;
  const { id, status, title, content, history } = await req.json();

  if (!user || !user.name) {
    return NextResponse.json({ success: false, message: "Invalid user" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ success: false, message: "Draft ID is required" }, { status: 400 });
  }

  if (status !== 'editing') {
    return NextResponse.json({ success: false, message: "Only drafts with status 'editing' can be modified" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const userResult = await client.query('SELECT id FROM users WHERE name = $1', [user.name]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    const draftResult = await client.query(
      'UPDATE drafts SET status = $1, title = $2, content = $3, history = $4 WHERE id = $5 AND "userId" = $6 AND status = $7 RETURNING *',
      [status, title, content, history, id, userId, 'editing']
    );

    if (draftResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Draft not found or you do not have permission to update this draft" }, { status: 404 });
    }

    const draft = draftResult.rows[0];

    return NextResponse.json({ success: true, draft });
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { user } = session;
  const { status, title, content, history } = await req.json();

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
      'INSERT INTO drafts ("userId", status, title, content, history) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, 'editing', title, content, history0]
    );

    const draft = draftResult.rows[0];

    return NextResponse.json({ success: true, draft });
  } finally {
    client.release();
  }
}
