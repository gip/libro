import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Publication } from '@/components/Publication'
import { pool } from '@/lib/db';
import { Suspense } from 'react';

type Publication = {
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

const getPublication = async (publicationId: string): Promise<Publication | null> => {
  const client = await pool.connect();
  
  try {
    const { rows } = await client.query(
      'SELECT signal FROM publications WHERE id = $1',
      [publicationId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0].signal;
  } finally {
    client.release();
  }
}

type Params = Promise<{ publicationId: string }>

const Page = async ({ params }: { params: Params }) => {

  const { publicationId } = await params;
  const publication = await getPublication(publicationId);

  return (<>
    <Header />
    <Suspense fallback={<div>Loading...</div>}>
      {publication && <Publication publication={publication} />}
      {!publication && <div>Publication not found</div>}
    </Suspense>
    <Footer />
  </>)
}

export default Page 