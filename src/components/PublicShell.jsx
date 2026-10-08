import { ArrowUpRight } from 'lucide-react'
import logo from '../assets/logo.png'
import '../pages/PublicSite.css'

export default function PublicShell({ activeView, children }) {
  return (
    <div className="public-site">
      <a className="site-skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>Lewati navigasi</a>
      <header className="site-header">
        <nav className="site-container site-nav" aria-label="Navigasi utama">
          <a className="site-brand" href="#home" aria-label="Artha Home">
            <img src={logo} alt="" width="40" height="40" />
            <span>artha<span className="brand-dot">.</span></span>
          </a>
          <div className="site-nav-links">
            <a href="#home" aria-current={activeView === 'home' ? 'page' : undefined}>Home</a>
            <a href="#about" aria-current={activeView === 'about' ? 'page' : undefined}>About</a>
          </div>
          <a href="#login" className="site-login" aria-current={activeView === 'login' ? 'page' : undefined}>
            Login <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </header>
      <div id="main-content" tabIndex={-1}>{children}</div>
      <footer className="site-footer">
        <div className="site-container site-footer-inner">
          <a className="site-brand" href="#home">artha<span className="brand-dot">.</span></a>
          <p>Data yang bermakna. Pendampingan yang lebih manusiawi.</p>
          <span>&copy; {new Date().getFullYear()} Artha</span>
        </div>
      </footer>
    </div>
  )
}
