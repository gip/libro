import { pool } from './index'
import { cache } from 'react'

export type Author = {
  id: string
  name: string
  bio?: string
}

type ContentOrHtml = {
  content: {
    type: string
    content: Array<any>
  }
} | {
  html: string
}

export type Publication = {
  author_id_libro: string
  publication_date: string
  author_name_libro: string
  publication_title: string
  publication_content: ContentOrHtml
  publication_subtitle: string
}

export type Proof = {
  proof: string
  merkle_root: string
  nullifier_hash: string
  verification_level: 'orb'
}

export const getAuthors = cache(async (userId: string): Promise<Author[]> => {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT a.id, a.name, a.bio 
       FROM authors a
       INNER JOIN users u ON u.id = a."userId"
       WHERE u.name = $1`,
      [userId]
    )

    return rows
  } finally {
    client.release()
  }
})

export const getPublication = cache(async (publicationId: string): Promise<Publication | null> => {
  const client = await pool.connect()
  console.log('LOA', publicationId)
  try {
    const { rows } = await client.query(
      'SELECT signal FROM publications WHERE id = $1',
      [publicationId]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0].signal
  } finally {
    client.release()
  }
})

export const getProof = cache(async (publicationId: string): Promise<Proof | null> => {
  const client = await pool.connect()
  console.log('LOB', publicationId)
  try {
    const { rows } = await client.query(
      'SELECT proof FROM publications WHERE id = $1',
      [publicationId]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0].proof
  } finally {
    client.release()
  }
})