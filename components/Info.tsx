'use client';

import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { Session, User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  session: Session | null;
  user: User | null | undefined;
}

export default function Info({
  session,
  user,
}: Props) {
  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center"></div>
        <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
          Generate PGP Keys from OAuth
        </p>
        <div className="my-2">
          <p className="sm:text-center">/api/keys/pgp</p>
          <iframe src="/api/keys/pgp" className="w-full my-4"/>
        </div>
        <p className="text-white sm:text-center underline my-5">
          <a href="policy" className="mx-2">Policy</a>
          <a href="https://github.com/Lucas-Kohorst/pgp-oauth" className="mx-2">Github</a>
        </p>
      </div>
    </section>
  );
}
