'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const isAdmin = Cookies.get('isAdmin');
    if (isAdmin === 'true') {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <div>Loading...</div>;
}