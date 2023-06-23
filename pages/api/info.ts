import * as openpgp from 'openpgp';

import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

const InfoRoute: NextApiHandler = async (req, res) => {
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

	res.send(JSON.stringify(session, null, 2))
};

export default InfoRoute;