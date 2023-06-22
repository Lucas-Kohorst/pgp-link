import * as openpgp from 'openpgp';
import { getServerSession} from "next-auth"
import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    // const name = session.user ? session.user.name : "fakeuser"
    // const email = session.user ? session.user.email : "fake"

    // const token = await getToken({ req }) 
    // const passphrase = token ? token.jti : null

    // if (name !== undefined && email !== undefined && passphrase !== undefined) {
    // const {publicKey, privateKey} = await generateKeyPair("name", "email", "passphrase")
    // const resp = {publicKey: publicKey, privateKey: privateKey}
    const resp = "user is logged in"
    res.send(JSON.stringify(resp, null, 2)) 
    // } else {
    //   res.send(JSON.stringify(null, 2))    
    // }
  } else {
    res.send(JSON.stringify(null))    
  }
  // res.send(JSON.stringify(session, null, 2))
}

async function generateKeyPair(name: string, email: string, passphrase: string): Promise<{ publicKey: string, privateKey: string }> {
  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
    type: 'ecc', // Type of the key, defaults to ECC
    curve: 'curve25519', // ECC curve name, defaults to curve25519
    userIDs: [{ name: name, email: email }], // you can pass multiple user IDs
    passphrase: passphrase, // protects the private key
    format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });

  console.log(privateKey)
  console.log(publicKey)

  return { publicKey: publicKey, privateKey: privateKey };
}