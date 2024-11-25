import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ publicationId: string }> }
): Promise<NextResponse> => {
  const { publicationId } = await context.params;

  if (!publicationId) {
    return NextResponse.json(
      { success: false, message: "Publication ID is required" },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    const publicationResult = await client.query(
      `SELECT p.title AS title,
              p.content AS content,
              a.name AS author_name
       FROM publications p 
       JOIN authors a ON p."authorId" = a.id 
       WHERE p.id = $1`,
      [publicationId]
    );

    if (publicationResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Publication not found" },
        { status: 404 }
      );
    }

    const publication = publicationResult.rows[0];

    return NextResponse.json({ success: true, data: publication });
  } finally {
    client.release();
  }
}
