import { useState } from 'react'
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react'
import { login } from '../services/authService'
import logoImg from '../assets/logo_teks.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      window.location.hash = 'dashboard'
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa username dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-primary-50 px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <section className="w-full text-center" aria-label="Artha login">
          <article className="rounded-2xl border border-primary-200 bg-white p-6 shadow-lg shadow-primary-200/40 sm:p-8">
            {/* Logo */}
            <img src={logoImg} alt="Artha Logo" className="mx-auto mb-5 h-48 w-full object-contain" />

            {/* <header className="mb-7">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-primary-950">
                Artha
              </h1>
              <p className="mt-1.5 text-xs font-semibold tracking-widest text-secondary-500 uppercase">
                Student Decision Support System
              </p>
            </header> */}

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-5 text-left" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600"
                >
                  Username
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="teacher@artha.edu"
                    className="w-full rounded-xl border border-secondary-200 bg-primary-50/50 py-3 pl-10 pr-3 text-sm text-primary-950 placeholder:text-secondary-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[10px] font-semibold text-tertiary-700 transition hover:text-tertiary-600 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-tertiary-200"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-secondary-200 bg-primary-50/50 py-3 pl-10 pr-3 text-sm text-primary-950 placeholder:text-secondary-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md shadow-primary-700/25 transition hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                    Signing In...
                  </>
                ) : (
                  <>Sign In →</>
                )}
              </button>
            </form>

            <p className="mt-7 border-t border-primary-100 pt-5 text-center text-[11px] font-semibold tracking-wide text-secondary-500">
              Need an account?{' '}
              <a
                href="#register"
                className="text-tertiary-700 transition hover:text-tertiary-600 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-tertiary-200"
              >
                Create Account
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
