'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://thkbnqmnatphefnnllme.supabase.co',
  'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC'
);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-neutral-950 border border-neutral-800 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold uppercase tracking-wider mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-2 uppercase font-bold text-sm disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}