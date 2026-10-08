import { ArrowRight, ArrowUpRight, ChartNoAxesCombined, FileUp, HeartHandshake, ScanLine } from 'lucide-react'

const capabilities = [
  { icon: ScanLine, title: 'Kenali lebih awal', text: 'Lihat pola risiko akademik dari performa, kehadiran, dan konteks belajar siswa.' },
  { icon: ChartNoAxesCombined, title: 'Lihat gambaran utuh', text: 'Satukan kondisi kelas dan perkembangan setiap siswa dalam satu dashboard.' },
  { icon: HeartHandshake, title: 'Tentukan pendampingan', text: 'Temukan rekomendasi intervensi yang dapat dipertimbangkan bersama guru.' },
]

export default function Home() {
  return (
    <main>
      <section className="site-hero" aria-labelledby="home-title">
        <img className="site-hero-image" src="/images/classroom.jpg" alt="Siswa menyimak pembelajaran bersama di ruang kelas" width="2000" height="1125" fetchPriority="high" />
        <div className="site-hero-wash" />
        <div className="site-container site-hero-content">
          <div className="site-hero-copy">
            <p className="site-kicker"><span /> Student Decision Support</p>
            <h1 id="home-title">Artha<span>.</span></h1>
            <h2>Setiap potensi layak<br className="desktop-break" /> mendapat perhatian.</h2>
            <p className="site-hero-description">Bantu guru memahami risiko akademik lebih awal dan memilih pendampingan yang tepat. Berawal dari data, berujung pada kepedulian.</p>
            <div className="site-actions">
              <a className="site-button" href="#login">Mulai dengan Artha <ArrowUpRight size={18} aria-hidden="true" /></a>
              <a className="site-text-link" href="#about">Kenali Artha <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
            <p className="site-hero-note">Untuk guru, wali kelas, dan pendamping belajar.</p>
          </div>
        </div>
        <span className="site-photo-credit">Foto: Unsplash</span>
      </section>

      <section className="site-capabilities" aria-label="Pendampingan berbasis data">
        <div className="site-container site-capabilities-grid">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-product site-container">
        <div className="site-section-heading">
          <h2>Dari kondisi kelas,<br />ke langkah yang lebih jelas.</h2>
          <p>Performa akademik, kehadiran, dan indikator risiko berada dalam satu pandangan. Ruang bagi guru untuk melihat siapa yang perlu didampingi lebih dulu.</p>
        </div>
        <figure className="site-product-figure">
          <img src="/images/dashboard-preview.png" alt="Dashboard Artha dengan ringkasan kelas, distribusi risiko, dan daftar prioritas pendampingan" width="1440" height="1000" loading="lazy" />
          <figcaption><span>Dashboard Artha</span><span>Pratinjau menggunakan data contoh</span></figcaption>
        </figure>
        <div className="site-workflow">
          <div><FileUp size={22} aria-hidden="true" /><h3>Masukkan data kelas</h3><p>Unggah CSV atau tambahkan data siswa.</p></div>
          <ArrowRight size={20} aria-hidden="true" />
          <div><ChartNoAxesCombined size={22} aria-hidden="true" /><h3>Pahami hasil analisis</h3><p>Tinjau indikator risiko dan riwayat assessment.</p></div>
          <ArrowRight size={20} aria-hidden="true" />
          <div><HeartHandshake size={22} aria-hidden="true" /><h3>Rencanakan dukungan</h3><p>Pertimbangkan rekomendasi sesuai kebutuhan siswa.</p></div>
        </div>
      </section>

      <section className="site-closing">
        <div className="site-container site-closing-inner">
          <div><h2>Perhatian hari ini.<br />Peluang yang lebih baik esok.</h2><p>Mulai memahami cerita di balik data siswa Anda.</p></div>
          <a href="#login" className="site-button site-button-light">Masuk ke Artha <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </section>
    </main>
  )
}
