import Link from "next/link"
import { Building2, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react"
import { FaWhatsapp, FaPinterest } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <Link href="/" className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <Building2 className="h-7 w-7 text-orange-500" />
              <span className="text-xl font-bold text-white">Al-Azab</span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm">
              شركة العزب للخدمات المعمارية - شريكك الموثوق للحلول الإنشائية المبتكرة
            </p>
            <p className="text-gray-400 mb-6 text-sm">
              Al-Azab Construction Services - Your trusted partner for innovative construction solutions
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link
                href="https://www.facebook.com/alazab24"
                target="_blank"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/MahamedAzab2"
                target="_blank"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <FaXTwitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/alazab.co/"
                target="_blank"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/alazab"
                target="_blank"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@al-azab_co"
                target="_blank"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.pinterest.com/alazabonline/"
                target="_blank"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <FaPinterest className="h-5 w-5" />
              </Link>
              <Link
                href="https://wa.me/c/201004006620"
                target="_blank"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <FaWhatsapp className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links - Apps */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">التطبيقات / Apps</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://alazab.com/app/crm"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  CRM
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab.com/app/helpdesk"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  Helpdesk
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab.com/app/hr"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  HR
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab.com/app/gameplan"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  Gameplan
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab.com/app/webshop"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  Webshop
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab.com/insights/dashboards"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">روابط سريعة / Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://alazab.com"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  الموقع الرسمي / Official Site
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab.com/studio/home"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  Studio
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab.com/builder/"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  Builder
                </Link>
              </li>
              <li>
                <Link
                  href="https://alazab-co.daftra.com/"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  متجر دفترة / Daftra Store
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.jotform.com/app/242544342306551"
                  target="_blank"
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                >
                  JotForm
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">اتصل بنا / Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start justify-center sm:justify-start gap-2">
                <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  القاهرة الجديدة، مصر
                  <br />
                  New Cairo, Egypt
                </span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm" dir="ltr">
                  +20 100 400 6620
                </span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <a href="mailto:info@alazab.com" className="text-gray-400 text-sm hover:text-orange-500">
                  info@alazab.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">
            © {new Date().getFullYear()} Al-Azab Construction Company. جميع الحقوق محفوظة / All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Made with ❤️ by{" "}
            <a
              href="https://alazab.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400"
            >
              Alazab.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
