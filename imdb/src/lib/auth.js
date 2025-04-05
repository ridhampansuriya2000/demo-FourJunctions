import { SignJWT, jwtVerify } from "jose"

export async function signJWT(payload) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "")
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret)

    return token
}

export async function verifyAuth(token) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "")
    const { payload } = await jwtVerify(token, secret)
    return payload
}