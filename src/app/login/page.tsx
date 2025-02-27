// First, let's create a login page
// Create this file at app/login/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';  // You'll need to install this: npm install js-cookie @types/js-cookie


export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

   // Check if already authenticated
  useEffect(() => {
    const isAdmin = Cookies.get('isAdmin');
    if (isAdmin === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded password - replace with your desired password
    const correctPassword = 'Challengingthechallenge2030!';
    
    if (password === correctPassword) {
      // Set a cookie that expires in 1 day
      Cookies.set('isAdmin', 'true', { expires: 1 });
      router.push('/dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-medium text-center">Admin Access</h2>
          <p className="mt-2 text-center text-gray-600">Enter password to continue</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enter Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}