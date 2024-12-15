
export type Author = {
    id: string
    name: string
    handle: string
    bio?: string
  }
  
  export type ContentOrHtml = {
    content: {
      type: string
      content: Array<any>
    }
  } | {
    html: string
  }

  // Publication payload V1 that is signed
  export type PublicationV1 = {
    author_id_libro: string
    publication_date: string
    author_name_libro: string
    author_handle_libro: string
    author_bio_libro: string
    publication_title: string
    publication_content: ContentOrHtml
    publication_subtitle: string
  }
  
  export type PublicationInfo = {
    id: string
    author_id_libro: string
    publication_date: string
    author_name_libro: string
    publication_title: string
    publication_subtitle: string
  }
  
  export type Proof = {
    proof: string
    merkle_root: string
    nullifier_hash: string
    verification_level: 'orb'
  }

  export type PublicationV1AndProof = {
    publication: PublicationV1
    proof: Proof
  }