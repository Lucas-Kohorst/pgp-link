import * as openpgp from 'openpgp';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getURL } from '@/utils/helpers';
import { Database } from '@/types_db';
import { NextResponse } from 'next/server'

export async function GET() {
    const data = await {
        name: "name",
        email: "email",
    }

    try {
        const supabase = createRouteHandlerClient<Database>({ cookies });
        const {
            data: { user }
        } = await supabase.auth.getUser();

        console.log(user)

        // get full name 
        const { data, error } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user?.id);

        if (error) {
            console.log(error);
            return NextResponse.json({ error: error });
        } else {
            return NextResponse.json({ user })
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Not Authenticated, Failed in Main' });
    }
}

// export async function POST(req: Request) {
//     console.log("GET")
//     if (req.method === 'GET') {
//         try {
//             const supabase = createRouteHandlerClient<Database>({ cookies });
//             const {
//                 data: { user }
//             } = await supabase.auth.getUser();

//             if (user == null) {
//                 return new Response(
//                     JSON.stringify({ error: { statusCode: 401, message: "Unauthorized, Sign In" } }),
//                     {
//                         status: 401
//                     }
//                 );
//             } else {
//                 console.log(user)
//                 // const name = user?.name
//                 const name = "name"
//                 const email = user?.email

//                 const passphrase = "passphrase"

//                 if (
//                     typeof name !== "string" ||
//                     typeof email !== "string" ||
//                     typeof passphrase !== "string"
//                 ) {
//                     return new Response(
//                         JSON.stringify({ error: { statusCode: 401, message: "Unauthorized, Sign In" } }),
//                         {
//                             status: 401
//                         }
//                     );
//                 } else {
//                     await generateKeyPair(name, email, passphrase).then((value) => {
//                         const publicKey = value.publicKey
//                         const privateKey = value.privateKey
//                         const response = { publicKey: publicKey, privateKey: privateKey }
//                         return new Response(JSON.stringify({ response }), {
//                             status: 200
//                         });
//                     }).catch((err) => {
//                         console.log(err)
//                         return new Response(
//                             JSON.stringify({ error: { statusCode: 500, message: "Unable to generate a PGP Key" } }),
//                             {
//                                 status: 500
//                             }
//                         );
//                     });
//                 }
//             }
//         } catch (err) {
//             console.log(err);
//             return new Response(JSON.stringify(err), { status: 400 });
//         };
//     }
// }

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