"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Menu, Moon, Sun, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { MobileMenu } from "@/components/mobile-menu"
import { useI18n } from "@/lib/i18n-context"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY + 5) {
        setScrollDirection("down")
      } else if (currentScrollY < lastScrollY - 5) {
        setScrollDirection("up")
      }

      if (currentScrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      if (currentScrollY < 50) {
        setScrollDirection("up")
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prevState) => !prevState)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar")
  }

  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 100,
        damping: 20,
        duration: prefersReducedMotion ? 0.1 : undefined,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 100,
        damping: 20,
        duration: prefersReducedMotion ? 0.1 : undefined,
      },
    },
  }

  const shouldShowNavbar = scrollDirection === "up" || !scrolled || lastScrollY < 50

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 w-full backdrop-blur-sm transition-all duration-300 ${
          scrolled ? "bg-background/95 shadow-md" : "bg-background/80"
        }`}
        initial="visible"
        animate={shouldShowNavbar ? "visible" : "hidden"}
        variants={navVariants}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="bg-orange-500 text-white p-2 rounded-lg"
                >
                  <Building2 className="h-6 w-6 md:h-7 md:w-7" />
                </motion.div>
                <div className="flex flex-col">
                  <motion.span
                    className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-none"
                    initial={{ opacity: 1 }}
                    whileHover={{ scale: 1.03, color: "#FF8C00" }}
                    transition={{ duration: 0.2 }}
                  >
                    {language === "ar" ? "العزب" : "Al-Azab"}
                  </motion.span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
                    {language === "ar" ? "نظام تخطيط موارد المؤسسة" : "ERP System"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center">
              <ul className="flex items-center space-x-2 lg:space-x-4">
                <NavItem href="/" label={t("home")} isActive={pathname === "/"} />
                <NavItem href="/#services" label={t("services")} isActive={false} />
                <NavItem href="/projects" label={t("projects")} isActive={pathname.startsWith("/projects")} />
                <NavItem href="/portfolio" label={t("portfolio")} isActive={pathname === "/portfolio"} />
                <NavItem href="/#contact" label={t("contact")} isActive={false} />
                <NavItem
                  href="https://alazab.com"
                  label={language === "ar" ? "الموقع الرسمي" : "Official Site"}
                  isActive={false}
                  external
                />
              </ul>
            </nav>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Toggle */}
              {mounted && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2 font-medium">
                    <Globe className="h-4 w-4" />
                    {language === "ar" ? "EN" : "ع"}
                  </Button>
                </motion.div>
              )}

              {/* Theme toggle */}
              {mounted && (
                <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9, rotate: 30 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={theme}
                        initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Moon className="h-5 w-5 text-gray-700" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile language toggle */}
              {mounted && (
                <Button variant="ghost" size="icon" onClick={toggleLanguage} className="h-9 w-9">
                  <Globe className="h-5 w-5" />
                </Button>
              )}

              {/* Mobile theme toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-9 w-9"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5 text-orange-500" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              {/* Hamburger Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-orange-50 dark:bg-orange-900/20"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  )
}

function NavItem({
  href,
  label,
  isActive,
  external = false,
}: {
  href: string
  label: string
  isActive: boolean
  external?: boolean
}) {
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <li>
      <Link
        href={href}
        {...linkProps}
        className={`relative px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors ${
          isActive
            ? "text-orange-500 dark:text-orange-400"
            : "text-foreground hover:text-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
        }`}
      >
        {label}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
            layoutId="navbar-underline"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </li>
  )
}
