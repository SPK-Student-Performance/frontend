import { ArrowUpRight, BrainCircuit, HeartHandshake, Layers3 } from 'lucide-react'

export default function About() {
  return (
    <main>
      <section className="site-about-intro site-container">
        <p className="site-kicker"><span /> Tentang Artha</p>
        <h1>Teknologi yang membantu.<br />Guru yang memahami.</h1>
        <div className="site-about-lede">
          <p>Di balik setiap angka, ada seorang siswa dengan perjalanan belajarnya sendiri.</p>
          <div><p>Artha adalah sistem pendukung keputusan untuk membantu guru mengidentifikasi risiko akademik dan mempertimbangkan intervensi yang sesuai.</p><p>Kami mempertemukan analisis data dengan kepedulian terhadap siswa. Hasil analisis menjadi bahan pertimbangan, sementara keputusan tetap berada di tangan pendidik.</p></div>
        </div>
      </section>

      <figure className="site-about-photo">
        <img src="/images/classroom.jpg" alt="Suasana belajar bersama, dengan siswa memperhatikan penjelasan guru" width="2000" height="1125" />
        <figcaption>Belajar bukan sekadar hasil. Ada proses yang perlu dipahami.</figcaption>
      </figure>

      <section className="site-container site-about-method">
        <div className="site-section-heading"><h2>Analisis yang terarah.<br />Pertimbangan yang utuh.</h2><p>Artha menggabungkan prediksi risiko dan pemeringkatan rekomendasi untuk mendukung pendampingan siswa.</p></div>
        <div className="site-method-rows">
          <article><BrainCircuit size={28} aria-hidden="true" /><h3>Random Forest</h3><p>Model mempelajari pola dari indikator siswa untuk menghasilkan probabilitas dan kategori risiko akademik.</p></article>
          <article><Layers3 size={28} aria-hidden="true" /><h3>Rekomendasi TOPSIS</h3><p>Alternatif intervensi diperingkat berdasarkan kriteria dan konteks siswa, sehingga guru punya titik awal untuk menentukan dukungan.</p></article>
          <article><HeartHandshake size={28} aria-hidden="true" /><h3>Pendidik tetap memutuskan</h3><p>Prediksi bukan label permanen atau pengganti penilaian guru. Validasi hasil dengan kondisi nyata sebelum mengambil tindakan.</p></article>
        </div>
      </section>
      <section className="site-closing"><div className="site-container site-closing-inner"><div><h2>Lebih memahami.<br />Lebih tepat mendampingi.</h2><p>Kenali kondisi kelas Anda bersama Artha.</p></div><a className="site-button site-button-light" href="#login">Masuk ke Artha <ArrowUpRight size={18} aria-hidden="true" /></a></div></section>
    </main>
  )
}
