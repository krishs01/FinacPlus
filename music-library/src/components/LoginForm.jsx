import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

/**
 * Login modal — username/password form with mock authentication.
 * Shows credentials hint for demo purposes.
 */
function LoginForm({ isOpen, onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Small delay to simulate network request
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      login(username, password);
      setUsername('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full max-w-sm animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Sign In</h2>
            <p className="text-xs text-slate-500 mt-0.5">Log in to manage songs</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/[0.08] transition-all"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-username" className="text-sm font-medium text-slate-300">Username</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-100 text-sm outline-none transition-all placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-sm font-medium text-slate-300">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-100 text-sm outline-none transition-all placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_2px_10px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Demo credentials hint */}
          <div className="mt-1 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="flex gap-3 text-xs">
              <div className="flex-1">
                <p className="text-slate-400 font-medium">Admin</p>
                <p className="text-slate-500">admin / admin123</p>
              </div>
              <div className="flex-1">
                <p className="text-slate-400 font-medium">Viewer</p>
                <p className="text-slate-500">user / user123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
