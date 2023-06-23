import Link from "next/link"
import styles from "./header.module.css"

import {
  Session,
  createPagesBrowserClient,
  createPagesServerClient
} from '@supabase/auth-helpers-nextjs';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useEffect, useState } from 'react';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header({ user, session }: { user: User | null; session: Session | null }) {
  const supabase = createPagesBrowserClient<Database>();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('users').select('*').single();
      setData(data);
    }

    if (user) loadData();
  }, [user, supabase]);

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${!session ? styles.loading : styles.loaded
            }`}
        >
          {!user && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <button
                className={styles.button}
                onClick={() => {
                  supabase.auth.signInWithOAuth({
                    provider: 'github',
                    options: {
                      scopes: 'repo',
                      redirectTo: 'http://localhost:3000/api/callback'
                    }
                  });
                }}
              >
                Login with github
              </button>
            </>
          )}
          {user && (
            <>
              {/* {user.image && (
                <span
                  style={{ backgroundImage: `url('${user.image}')` }}
                  className={styles.avatar}
                />
              )} */}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{user.username ?? user.full_name}</strong>
              </span>
              <button
                className={styles.button}
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
              >
                Logout
              </button>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/info">Info</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/api-example">API</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient<Database>(ctx);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return {
    props: {
      session,
      user: session?.user ?? null
    }
  };
};
