import { pool } from '@/lib/db'
import { cache } from 'react'

export type Publication = {
  author_id_libro: string;
  publication_date: string;
  author_name_libro: string;
  publication_title: string;
  publication_content: {
    content: {
      type: string;
      content: Array<any>;
    }
  };
  publication_subtitle: string;
}

export const getPublication = cache(async (publicationId: string): Promise<Publication | null> => {
  const client = await pool.connect()
  console.log('LOA', publicationId)
  try {
    const { rows } = await client.query(
      'SELECT signal FROM publications WHERE id = $1',
      [publicationId]
    );

    if (rows.length === 0) {
      return null
    }

    return rows[0].signal;
  } finally {
    client.release()
  }
})

export default async function Layout({ 
    children,
    params: { pubId }
  }: {
    children: React.ReactNode
    params: { pubId: string }
  }) {
    const publication = await getPublication(pubId)
    return children
  }
