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

    if (session == null) {
      res.status(401).send("Unauthorized")
      return
    }
    else {
      const name = session?.user?.name
      const email = session?.user?.email

      const token = await getToken({ req }) 
      const passphrase = token?.jti

      if (
        typeof name !== "string" ||
        typeof email !== "string"
        typeof passphrase !== "string"
      ) {
        res.status(400).send("Unauthorized")
        return
      } else {
        await generateKeyPair(name, email, passphrase).then((value) => {
          const publicKey = value.publicKey
          const privateKey = value.privateKey
          const response = {publicKey: publicKey, privateKey: privateKey}
          res.send(JSON.stringify(response, null, 2)) 
        }).catch((err) => {
          console.log(err)
        });
      }
    }
}

async function generateKeyPair(name: string, email: string, passphrase: string): Promise<{ publicKey: string, privateKey: string }> {
  const userIds = [{ name: name, email: email }]
  return openpgp.generateKey({
    type: 'ecc', // Type of the key, defaults to ECC
    curve: 'curve25519', // ECC curve name, defaults to curve25519
    userIDs: userIds, // you can pass multiple user IDs
    passphrase: passphrase, // protects the private key
    format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  })
}