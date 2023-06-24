import Info from '@/components/Info';
import {
  getSession,
} from '@/app/supabase-server';

export default async function InfoPage() {
  const [session] = await Promise.all([
    getSession(),
  ]);

  return (
    <Info
      session={session}
      user={session?.user}
    />
  );
}
