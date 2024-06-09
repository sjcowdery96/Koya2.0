// middleware.ts
//export { auth as middleware } from "./auth"
export { default } from "next-auth/middleware"

//* zero or more
//+ one or more
//? zero or one
export const config = { matcher: ["/dashboard"] }
