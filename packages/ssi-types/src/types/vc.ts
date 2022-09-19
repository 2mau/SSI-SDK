import { PresentationSubmission } from './pex'
import { IProofPurpose, IProofType } from './did'

export type AdditionalClaims = Record<string, any>

export interface ICredential {
  // If exp is present, the UNIX timestamp MUST be converted to an [XMLSCHEMA11-2] date-time, and MUST be used to set the value of the expirationDate property of credentialSubject of the new JSON object.
  expirationDate?: string
  // If iss is present, the value MUST be used to set the issuer property of the new credential JSON object or the holder property of the new presentation JSON object.
  issuer: string | IIssuer
  // If nbf is present, the UNIX timestamp MUST be converted to an [XMLSCHEMA11-2] date-time, and MUST be used to set the value of the issuanceDate property of the new JSON object.
  issuanceDate: string
  // If sub is present, the value MUST be used to set the value of the id property of credentialSubject of the new credential JSON object.
  credentialSubject: ICredentialSubject & AdditionalClaims
  // If jti is present, the value MUST be used to set the value of the id property of the new JSON object.
  id?: string
  '@context': ICredentialContextType[] | ICredentialContextType
  credentialStatus?: ICredentialStatus
  credentialSchema?: undefined | ICredentialSchemaType | ICredentialSchemaType[]
  description?: string
  name?: string
  type: string[]

  [x: string]: any
}

export interface ICredentialSubject {
  id?: string
}

export type ICredentialContextType = (ICredentialContext & AdditionalClaims) | string

export interface ICredentialContext {
  name?: string
  did?: string
}

export type ICredentialSchemaType = ICredentialSchema | string

export interface ICredentialSchema {
  id: string
  type?: string
}

export interface IProof {
  type: IProofType | string // The proof type
  created: string // The ISO8601 date-time string for creation
  proofPurpose: IProofPurpose | string // The specific intent for the proof
  verificationMethod: string // A set of parameters required to independently verify the proof
  challenge?: string // A challenge to protect against replay attacks
  domain?: string // A string restricting the (usage of a) proof to the domain and protects against replay attacks
  proofValue?: string // One of any number of valid representations of proof values
  jws?: string // JWS based proof
  nonce?: string // Similar to challenge. A nonce to protect against replay attacks, used in some ZKP proofs
  requiredRevealStatements?: string[] // The parts of the proof that must be revealed in a derived proof
}

export interface ICredentialStatus {
  id: string
  type: string
}

export interface IIssuer {
  id: string

  [x: string]: any
}

export interface IHasProof {
  proof: IProof | IProof[]
}

export type IVerifiableCredential = ICredential & IHasProof

export interface IPresentation {
  id?: string
  '@context': ICredentialContextType | ICredentialContextType[]
  type: string[]
  verifiableCredential: IVerifiableCredential[] // we relax to ICredential for internal decoded stable representations without proofs
  presentation_submission?: PresentationSubmission
  holder?: string

  [x: string]: any
}

export type IVerifiablePresentation = IPresentation & IHasProof

export interface WrappedVerifiableCredential {
  /**
   * Original VC that we've received
   */
  original: OriginalVerifiableCredential
  /**
   * In case of JWT credential it will be the decoded version. In other cases it will be the same as original one
   */
  decoded: JwtDecodedVerifiableCredential | IVerifiableCredential
  /**
   * Type of this credential. Supported types are json-ld and jwt (decoded/encoded)
   */
  type: OriginalType
  /**
   * The claim format, typically used during exchange transport protocols
   */
  format: ClaimFormat
  /**
   * Internal stable representation of a Credential without Proofs, created based on https://www.w3.org/TR/vc-data-model/#jwt-decoding
   */
  credential: ICredential
}

export interface WrappedVerifiablePresentation {
  /**
   * Original VP that we've received
   */
  original: OriginalVerifiablePresentation
  /**
   * In case of JWT VP it will be the decoded version. In other cases it will be the same as original one
   */
  decoded: JwtDecodedVerifiablePresentation | IVerifiablePresentation
  /**
   * Type of this Presentation. Supported types are json-ld and jwt (decoded/encoded)
   */
  type: OriginalType
  /**
   * The claim format, typically used during exchange transport protocols
   */
  format: ClaimFormat
  /**
   * Internal stable representation of a Presentation without proofs, created based on https://www.w3.org/TR/vc-data-model/#jwt-decoding
   */
  presentation: UniformVerifiablePresentation
  /**
   * Wrapped Verifiable Credentials belonging to the Presentation
   */
  vcs: WrappedVerifiableCredential[]
}

export enum OriginalType {
  JSONLD = 'json-ld',
  JWT_ENCODED = 'jwt-encoded',
  JWT_DECODED = 'jwt-decoded',
}

export interface UniformVerifiablePresentation {
  '@context': ICredentialContextType | ICredentialContextType[]
  type: string[]
  verifiableCredential: WrappedVerifiableCredential[]
  presentation_submission?: PresentationSubmission
  holder?: string
}

export interface JwtDecodedVerifiableCredential {
  vc: ICredential
  exp: string
  iss: string
  nbf: string
  sub: string
  jti: string

  [x: string]: any
}

export interface JwtDecodedVerifiablePresentation {
  vp: IVerifiablePresentation
  exp: string
  iss: string
  nbf: string
  sub: string
  jti: string

  [x: string]: any
}

export type ClaimFormat = 'jwt' | 'jwt_vc' | 'jwt_vp' | 'ldp' | 'ldp_vc' | 'ldp_vp' | string

export type OriginalVerifiableCredential = IVerifiableCredential | JwtDecodedVerifiableCredential | string
export type OriginalVerifiablePresentation = IPresentation | JwtDecodedVerifiablePresentation | string
export type Original = OriginalVerifiablePresentation | OriginalVerifiableCredential
