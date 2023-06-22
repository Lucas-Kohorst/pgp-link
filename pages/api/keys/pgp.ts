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
    const { name, email } = session.user
    const token = await getToken({ req }) 

    const passphrase = token?.jti
    const {publicKey, privateKey} = await generateKeyPair(name, email, passphrase)

    res.send(JSON.stringify((publicKey + privateKey), null, 2))    
  } else {
    res.send(JSON.stringify(null, 2))    
  }

}

async function generateKeyPair(name: string, email: string, passphrase: string): Promise<{ publicKey: string, privateKey: string }> {
  const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
    userIds: [{ name: name, email: email }],
    curve: 'ed25519',
    passphrase: passphrase
  });
  return { publicKey: publicKeyArmored, privateKey: privateKeyArmored };
}