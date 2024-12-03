import Editor from '@/components/Editor'
import { Diamond } from '@/components/Diamond'
import { Proof as ProofType, Publication as PublicationType, Author as AuthorType } from '@/lib/db/publication'

export const Proof = ({ publication, proof }: { publication: PublicationType, proof: ProofType }) => {

  const authors: AuthorType[] = [{ id: '0', name: 'Libro Team' }]

  const title = 'Independent Verification of Human Authorship'

  const contentRaw = `This document will show how to independently verify the proof of authorship of the publication '${publication.publication_title}' by <a href="${process.env.NEXT_PUBLIC_APP_URL}/a/${publication.author_id_libro}">${publication.author_name_libro}</a>.
<br/>
<br/>In a zero-knowledge world, the proof of authorship should always be verifiable by external parties. In the longer term, it should be possible for any agent or consumer of content to verify the proof of Human Authorship (HA) and trust the content without relying on Libro or even World's zero-knowledge infrastructure.
<br/>As a first step, we provide a way to independently verify the proof of authorship using World's zero-knowledge infrastructure. In the future, we plan to support our own independent implementation of proof verification as well.
<br/>
<br/>Below is a step-by-step guide to verify the proof of authorship of the publication using Node.js. There are two external dependencies:
<br/>1. The Worldcoin proof verification implementation and its <a href="https://docs.world.org/world-id/reference/api#verify-proof">API endpoint</a>.
<br/>2. The Keccak256 hashing algorithm, which is implemented in the <a href="https://www.npmjs.com/package/ox">ox library</a>.
<br/>
<br/>The script provided includes the following steps:
<br/>1. Gathering the data from the document (author, title, subtitle, content and publication date) in the <i>publication</i> object.
<br/>2. Gathering the data from the proof in the <i>proof</i> object.
<br/>3. Hashing the <i>publication</i> object to create a hash called <i>signal_hash</i>. It is practically impossible to forge a different document with the same hash.
<br/>4. Creating the body of the request.
<br/>5. Sending the request to the Worldcoin API endpoint.
<br/>6. Printing the response that will be a JSON object. The success field will be true if the proof is valid.
<br/>
<br/>Running the script in your trusted environment like your local machine should be straightforward. You should make sure you have Node.js installed as well as the ox library (\`ox\` can be installed with \`npm install ox\`).
<br/>
<pre><code class="language-javascript">// This is the document that will be verified
<br>const publication = {
<br/>  // ID for this athor, refer to ${process.env.NEXT_PUBLIC_APP_URL}/a/${publication.author_id_libro}
<br/>  author_id_libro: '${publication.author_id_libro}',
<br/>  // This is the name of the author who signed the document
<br/>  author_name_libro: '${publication.author_name_libro}',
<br/>  // Below are title, subtitle, content and publication date
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
<br/>const input = Buffer.from(JSON.stringify(publication));
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
<br/>  headers: { 'Content-Type': 'application/json' },
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
              initialTitle={title}
              initialSubtitle={''}
              initialAuthorId={'0'}
              editable={false}
              codeBlocks={true}
              />
        <Diamond />
    </div>
  );
}
