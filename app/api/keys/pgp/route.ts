import * as openpgp from 'openpgp';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getURL } from '@/utils/helpers';
import { Database } from '@/types_db';

export async function GET(req: Request) {
    if (req.method === 'GET') {
        const supabase = createRouteHandlerClient<Database>({ cookies });
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (user == null) {
            return new Response(
                JSON.stringify({ error: { statusCode: 401, message: "Unauthorized, Sign In" } }),
                {
                    status: 401
                }
            );
        } else {
            console.log(user)
            // const name = user?.name
            const name = "name"
            const email = user?.email

            const passphrase = "passphrase"

            if (
                typeof name !== "string" ||
                typeof email !== "string" ||
                typeof passphrase !== "string"
            ) {
                return new Response(
                    JSON.stringify({ error: { statusCode: 401, message: "Unauthorized, Sign In" } }),
                    {
                        status: 401
                    }
                );
            } else {
                await generateKeyPair(name, email, passphrase).then((value) => {
                    const publicKey = value.publicKey
                    const privateKey = value.privateKey
                    const response = { publicKey: publicKey, privateKey: privateKey }
                    return new Response(JSON.stringify({ response }), {
                        status: 200
                      });
                }).catch((err) => {
                    console.log(err)
                    return new Response(
                        JSON.stringify({ error: { statusCode: 500, message: "Unable to generate a PGP Key" } }),
                        {
                            status: 500
                        }
                    );
                });
            }
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