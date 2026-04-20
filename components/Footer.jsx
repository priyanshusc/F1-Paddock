export default function Footer() {
  return (
    <div className="footer-wrap" style={{ maxWidth:'1440px', margin:'0 auto', padding:'32px 36px 40px' }}>
      <footer style={{ borderTop:'1px solid var(--ink)', paddingTop:'22px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'var(--ink-3)', letterSpacing:'.18em', textTransform:'uppercase' }}>
          For Priyanshu · eyes only
          <span className="f-dot" />
          Lights out and away we go
        </div>
        <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'15px', fontStyle:'italic', color:'var(--ink-2)' }}>
          The <em style={{ color:'var(--racing)', fontWeight:500 }}>Pit Wall</em>
        </div>
      </footer>
    </div>
  );
}
