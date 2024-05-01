// app/api/auth/[...nextauth]/route.ts
//authjs.dev
/*
import { handlers } from "../../../sign_in/auth"
export const { GET, POST } = handlers
*/
//code with mosh

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
//our handler

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ]
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


