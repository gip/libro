import Editor from '@/components/Editor'
import { Diamond } from '@/components/Diamond'
import { Proof as ProofType, Publication as PublicationType } from '@/lib/db/publication'

type Author = {
  id: string;
  name: string;
}

const br = { type: 'paragraph', content: [{ type: 'text', text: '\n' }] }

export const Proof = ({ publication, proof }: { publication: PublicationType, proof: ProofType }) => {

  const authors: Author[] = [{ id: publication.author_id_libro, name: publication.author_name_libro }]

  const contentRaw = `How to independently verify the proof of authorship of the publication '${publication.publication_title}'
<pre><code class="language-javascript">// This is the document that will be verified
<br>const signal = {
<br/>  author_id_libro: '${publication.author_id_libro}',  // This is the ID of the author who signed the document
<br/>  author_name_libro: '${publication.author_name_libro}',
<br/>  publication_title: '${publication.publication_title}',
<br/>  publication_subtitle: '${publication.publication_subtitle}',
<br/>  publication_content: ${JSON.stringify(publication.publication_content).replace(/</g, '&lt;').replace(/>/g, '&gt;')},
<br/>  publication_date: '${publication.publication_date}'
<br/>};
<br/>
<br/>// The zero-knowledge proof
<br/>const proof = '${proof.proof}';
<br/>const merkle_root = '${proof.merkle_root}';
<br/>const nullifier_hash = '${proof.nullifier_hash}';
<br/>const verification_level = '${proof.verification_level}';
<br/>
<br/>// Hashing the document data to create a signal hash
<br/>const input = Buffer.from(JSON.stringify(signal));
<br/>const { Hash } = require('ox');
<br/>const hash = BigInt(Hash.keccak256(input, { as: 'Hex' })) >> 8n;
<br/>const rawDigest = hash.toString(16);
<br/>const signal_hash = &#96;0x&#36;{rawDigest.padStart(64, '0')}&#96;;
<br/>
<br/>// Creating the body of the request
<br/>const body = {
<br/>  proof,
<br/>  merkle_root,
<br/>  nullifier_hash,
<br/>  verification_level,
<br/>  action: 'written-by-a-human',
<br/>  signal_hash
<br/>};
<br/>// Sending the request
<br>const app_id = \`${process.env.NEXT_PUBLIC_WLD_CLIENT_ID}\`;
<br>const url = \`https://developer.worldcoin.org/api/v2/verify/\${app_id}\`;
<br>const response = await fetch(url, {
<br/>  method: 'POST',
<br/>  headers: {
<br/>    'Content-Type': 'application/json'
<br/>  },
<br/>  body: JSON.stringify(body)
<br/>});
<br>// Print the response
<br>const json = await response.json();
<br>console.log(json);
`

  const content = contentRaw.replace(/\n/g, '')

  return (
    <div className="w-[90%] mx-auto space-y-4 py-4">
        <Editor authors={authors}
              initialContent={content}
              initialTitle={'How to Independently Verify the Proof'}
              initialSubtitle={''}
              initialAuthorId={publication.author_id_libro}
              editable={false}
              />
        <Diamond />
    </div>
  );
}
