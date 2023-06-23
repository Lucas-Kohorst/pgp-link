import { useRouter } from 'next/router';
import { createPagesBrowserClient, Session } from '@supabase/auth-helpers-nextjs';
import type { AppProps } from 'next/app';
import '../styles/styles.css';

function MyApp({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
	const router = useRouter();
	const supabase = createPagesBrowserClient<Database>();

	return (
		<Component {...pageProps} />
	);
}

export default MyApp;