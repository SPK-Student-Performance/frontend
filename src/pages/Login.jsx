import { useState } from 'react'
import { GraduationCap, Lock, Mail } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <section className="w-full text-center" aria-label="Artha login">
          <article className="rounded-xl border border-gray-200/90 bg-white p-6 shadow-sm sm:p-7">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-white">
              <GraduationCap size={18} aria-hidden="true" />
            </div>

            <header className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Artha
              </h1>
              <p className="mt-1 text-xs font-medium tracking-wide text-slate-500">
                Student Decision Support System
              </p>
            </header>

            <form className="space-y-4 text-left" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-500"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="teacher@artha.edu"
                    className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-500"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[10px] font-medium text-cyan-700 transition hover:text-cyan-800 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-cyan-200"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                    className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              >
                Sign In {'->'}
              </button>
            </form>

            <p className="mt-6 border-t border-gray-200 pt-4 text-center text-[10px] font-medium tracking-wide text-slate-500">
              Authorized Institutional Access Only
            </p>
          </article>

          <footer className="mt-4 text-[9px] font-medium uppercase tracking-[0.13em] text-slate-400">
            ARTHA STUDENT DECISION SUPPORT SYSTEM • V1.0
          </footer>
        </section>
      </div>
    </main>
  )
}
