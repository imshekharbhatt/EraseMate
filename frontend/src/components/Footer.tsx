export default function Footer() {
  const year = new Date().getFullYear()

  const cols = [
    {
      title: 'Product',
      links: ['Features', 'API Docs', 'Pricing', 'Changelog', 'Status'],
    },
    {
      title: 'Solutions',
      links: ['E-commerce', 'Photography', 'Marketing', 'Developers', 'Enterprise'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
    },
  ]

  return (
    <footer className="bg-white border-t border-line py-12 px-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[200px_1fr_1fr_1fr] gap-12 max-md:grid-cols-2 max-md:gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-[17px] font-extrabold text-text tracking-tight mb-3">
            <div className="w-6 h-6 bg-purple rounded-[6px] flex items-center justify-center">
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M5 7l1.5 1.5L9.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Erase<span className="text-purple">Mate</span>
          </div>
          <p className="text-[13px] text-muted leading-[1.7]">
            Professional AI background removal. Built for designers, developers, and teams who need precision at scale.
          </p>
        </div>

        {/* Cols */}
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-[12px] font-bold tracking-[0.08em] text-text uppercase mb-4">{col.title}</p>
            <div className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[13.5px] text-muted no-underline hover:text-text transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="max-w-[1200px] mx-auto mt-9 pt-6 border-t border-line flex items-center justify-between max-md:flex-col max-md:gap-3 max-md:text-center">
        <p className="text-[12.5px] text-muted2">© {year} EraseMate. All rights reserved.</p>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
            <a key={t} href="#" className="text-[12.5px] text-muted2 no-underline hover:text-text2 transition-colors">{t}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
