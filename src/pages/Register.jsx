import { useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Lock, Mail, User } from 'lucide-react'
import { register } from '../services/authService'
import logoImg from '../assets/logo_teks.png'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    try {
      await register(email, password, fullName)
      setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...')
      setTimeout(() => { window.location.hash = 'login' }, 1500)
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-secondary-200 bg-primary-50/50 py-3 pl-10 pr-3 text-sm text-primary-950 placeholder:text-secondary-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60'

  return (
    <main className="auth-page min-h-screen bg-primary-50 px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <section className="w-full text-center" aria-label="Artha register">
          <article className="rounded-2xl border border-primary-200 bg-white p-6 shadow-lg shadow-primary-200/40 sm:p-8">
            <img src={logoImg} alt="Artha Logo" className="mx-auto mb-5 h-48 w-full object-contain" />

            <header className="mb-4">
              {/* <h1 className="font-heading text-3xl font-bold tracking-tight text-primary-950">
                Artha
              </h1> */}
              <p className="mt-1.5 text-xs font-semibold tracking-widest text-secondary-500 uppercase">
                Create Your Account
              </p>
            </header>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form className="space-y-5 text-left" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <input id="fullName" type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Smith" className={inputClass} required disabled={loading} />
                </div>
              </div>

              <div>
                <label htmlFor="registerEmail" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">
                  Username
                </label>
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <input id="registerEmail" type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@artha.edu" className={inputClass} required disabled={loading} />
                </div>
              </div>

              <div>
                <label htmlFor="registerPassword" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <input id="registerPassword" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required disabled={loading} />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} required disabled={loading} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md shadow-primary-700/25 transition hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Creating Account...</>
                ) : (
                  <>Create Account <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            <p className="mt-7 border-t border-primary-100 pt-5 text-center text-[11px] font-semibold tracking-wide text-secondary-500">
              Already have an account?{' '}
              <a href="#login" className="text-tertiary-700 transition hover:text-tertiary-600">
                Sign In
              </a>
            </p>
          </article>

          <footer className="mt-5 text-[9px] font-bold uppercase tracking-[0.15em] text-secondary-400">
            Artha Student Decision Support System • V1.0
          </footer>
        </section>
      </div>
    </main>
  )
}
