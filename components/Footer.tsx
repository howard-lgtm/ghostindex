import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size={24} />
              <span className="text-lg font-bold gradient-text">GhostIndex</span>
            </Link>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              Exposing company ghosting practices to create transparency in hiring.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Search Companies
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Report Ghosting
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@getghostindex.com" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="mailto:support@getghostindex.com?subject=Bug Report" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Report a Bug
                </a>
              </li>
              <li>
                <a href="mailto:support@getghostindex.com?subject=Feature Request" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Feature Request
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://twitter.com/ghostindex" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-action transition-colors" 
                  style={{ color: 'var(--text-dim)' }}
                >
                  Twitter/X
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/ghostindex" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-action transition-colors" 
                  style={{ color: 'var(--text-dim)' }}
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/howard-lgtm/ghostindex" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-action transition-colors" 
                  style={{ color: 'var(--text-dim)' }}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-sm hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                  DMCA Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-center text-sm" style={{ color: 'var(--text-dim)' }}>
            © {new Date().getFullYear()} GhostIndex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
