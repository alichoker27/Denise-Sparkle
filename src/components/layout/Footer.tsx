import Link from "next/link";
import { Container } from "./Container";
import { FaInstagram, FaWhatsapp, FaTiktok, FaEnvelope } from "react-icons/fa";

export function Footer() {
  const whatsappNumber = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "");
  const hasValidWhatsAppNumber = Boolean(
    whatsappNumber && /^[1-9]\d{6,14}$/.test(whatsappNumber),
  );

  return (
    <footer className="bg-surface-soft border-t border-border mt-auto py-8">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Socials */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="font-display text-xl text-ink font-semibold tracking-widest">
              DENISE SPARKLE
            </Link>
            <div className="flex gap-4 mt-1">
              <a href="https://www.instagram.com/denise_sparkle_?lqvp=c2w4OG9sd2lndTFu" target="_blank" rel="noreferrer" className="text-ink-muted hover:text-rose-500 transition-colors" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
              
              {hasValidWhatsAppNumber && (
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-rose-500 transition-colors" aria-label="WhatsApp">
                  <FaWhatsapp size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Essential Links */}
          <div className="flex gap-6 text-sm text-ink-soft">
            <Link href="/shop" className="hover:text-rose-500 transition-colors">Shop</Link>
            <Link href="/collections" className="hover:text-rose-500 transition-colors">Collections</Link>
            <Link href="/about" className="hover:text-rose-500 transition-colors">About</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end gap-1 text-sm text-ink-muted">
            <a href="mailto:donizkhatib55@gmail.com" className="flex items-center gap-2 hover:text-rose-500 transition-colors">
              <FaEnvelope size={14} /> donizkhatib55@gmail.com
            </a>
            <p className="text-xs mt-1">Handcrafted with love in Lebanon.</p>
          </div>
          
        </div>
      </Container>
    </footer>
  );
}