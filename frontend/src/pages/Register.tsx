import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12">
        <div className="text-white font-mono text-sm tracking-wide">NEURO-SCAN</div>
        <div>
          <h2 className="text-white text-3xl font-semibold leading-snug mb-3">
            Track every scan, prediction, and confidence score in one place.
          </h2>
          <p className="text-slate-400 text-sm max-w-sm">
            Built for coursework and demonstration — a full prediction pipeline from upload to report.
          </p>
        </div>
        <div className="text-slate-500 text-xs font-mono">Educational use only — not a diagnostic device</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[#0F172A] mb-1">Create account</h1>
          <p className="text-slate-500 text-sm mb-8">Start uploading and tracking scans</p>

          {error && (
            <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2 rounded mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D9488] text-white py-2.5 rounded text-sm font-medium hover:bg-teal-700 transition disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6">
            Already have an account? <Link to="/login" className="text-teal-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;