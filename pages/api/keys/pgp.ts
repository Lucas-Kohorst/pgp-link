import * as openpgp from 'openpgp';

import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

const PGPRoute: NextApiHandler = async (req, res) => {
	// Create authenticated Supabase Client
	const supabase = createPagesServerClient<Database>({ req, res });
	// Check if we have a session
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!session)
		return res.status(401).json({
			error: 'not_authenticated',
			description: 'The user does not have an active session or is not authenticated'
		});
	
	const name = session?.user?.name
	const email = session?.user?.email
	const passphrase = "test"

	await generateKeyPair(name, email, passphrase).then((value) => {
		const publicKey = value.publicKey
		const privateKey = value.privateKey
		const response = { publicKey: publicKey, privateKey: privateKey }
		res.send(JSON.stringify(response, null, 2))
	}).catch((err) => {
		console.log(err)
	});

};

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

export default PGPRoute;