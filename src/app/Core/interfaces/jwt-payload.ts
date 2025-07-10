
export interface JwtPayload {
  exp: number; // expiration time (UNIX timestamp in seconds)
  [key: string]: any; // optional: allow any other properties
}