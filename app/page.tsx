"use client"
import Image from "next/image"
import {
  Building2,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Hammer,
  Building,
  Wrench,
  PaintBucket,
  Ruler,
} from "lucide-react"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerIn } from "@/components/animations/stagger-in"
import { HoverCard } from "@/components/animations/hover-card"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function HomePage() {
  const { t, language } = useI18n()

  const stats = [
    { number: "230", label: language === "ar" ? "مشروع منجز" : "Completed Projects" },
    { number: "15", label: language === "ar" ? "سنة خبرة" : "Years Experience" },
    { number: "68", label: language === "ar" ? "عميل راضٍ" : "Happy Clients" },
    { number: "50", label: language === "ar" ? "موظف محترف" : "Professional Staff" },
  ]

  const services = [
    {
      icon: Building,
      title: language === "ar" ? "البناء السكني" : "Residential Construction",
      description:
        language === "ar"
          ? "نقدم خدمات بناء سكنية متكاملة من التصميم إلى التسليم"
          : "Complete residential construction services from design to delivery",
    },
    {
      icon: Building2,
      title: language === "ar" ? "البناء التجاري" : "Commercial Construction",
      description:
        language === "ar"
          ? "مشاريع تجارية وإدارية بأعلى معايير الجودة"
          : "Commercial and administrative projects with highest quality standards",
    },
    {
      icon: Ruler,
      title: language === "ar" ? "التصميم المعماري" : "Architectural Design",
      description:
        language === "ar"
          ? "تصاميم معمارية مبتكرة تناسب احتياجاتك"
          : "Innovative architectural designs that suit your needs",
    },
    {
      icon: Hammer,
      title: language === "ar" ? "أعمال التشطيبات" : "Finishing Works",
      description:
        language === "ar"
          ? "تشطيبات داخلية وخارجية بأفضل الخامات"
          : "Interior and exterior finishing with best materials",
    },
    {
      icon: PaintBucket,
      title: language === "ar" ? "الديكور الداخلي" : "Interior Decoration",
      description:
        language === "ar" ? "تصميم وتنفيذ ديكورات داخلية عصرية" : "Design and execution of modern interior decorations",
    },
    {
      icon: Wrench,
      title: language === "ar" ? "الإشراف الهندسي" : "Engineering Supervision",
      description:
        language === "ar"
          ? "إشراف هندسي متكامل على جميع مراحل المشروع"
          : "Complete engineering supervision on all project phases",
    },
  ]

  const projects = [
    {
      image: "/modern-villa-exterior.png",
      title: language === "ar" ? "فيلا سكنية فاخرة" : "Luxury Residential Villa",
      category: language === "ar" ? "سكني" : "Residential",
    },
    {
      image: "/modern-apartment-building.png",
      title: language === "ar" ? "مبنى سكني" : "Apartment Building",
      category: language === "ar" ? "سكني" : "Residential",
    },
    {
      image: "/modern-commercial-building.png",
      title: language === "ar" ? "مبنى إداري" : "Commercial Building",
      category: language === "ar" ? "تجاري" : "Commercial",
    },
    {
      image: "/construction-site.png",
      title: language === "ar" ? "مشروع تحت الإنشاء" : "Under Construction",
      category: language === "ar" ? "قيد التنفيذ" : "In Progress",
    },
  ]

  const testimonials = [
    {
      name: language === "ar" ? "أحمد محمد" : "Ahmed Mohamed",
      role: language === "ar" ? "مالك عقار" : "Property Owner",
      image: "/professional-man-portrait.png",
      text:
        language === "ar"
          ? "خدمة ممتازة واحترافية عالية. تم تسليم المشروع في الوقت المحدد وبجودة فائقة."
          : "Excellent service and high professionalism. Project delivered on time with superior quality.",
      rating: 5,
    },
    {
      name: language === "ar" ? "فاطمة علي" : "Fatima Ali",
      role: language === "ar" ? "مستثمرة" : "Investor",
      image: "/professional-woman-portrait.png",
      text:
        language === "ar"
          ? "فريق محترف ومتعاون. أنصح بالتعامل معهم لأي مشروع إنشائي."
          : "Professional and cooperative team. I recommend them for any construction project.",
      rating: 5,
    },
    {
      name: language === "ar" ? "خالد حسن" : "Khaled Hassan",
      role: language === "ar" ? "مطور عقاري" : "Real Estate Developer",
      image: "/confident-businessman.png",
      text:
        language === "ar"
          ? "تجربة رائعة من البداية للنهاية. جودة عالية وأسعار منافسة."
          : "Wonderful experience from start to finish. High quality and competitive prices.",
      rating: 5,
    },
  ]

  const team = [
    {
      name: language === "ar" ? "م. محمد العزب" : "Eng. Mohamed Al-Azab",
      role: language === "ar" ? "المدير التنفيذي" : "CEO",
      image: "/construction-engineer-portrait.jpg",
    },
    {
      name: language === "ar" ? "م. أحمد سعيد" : "Eng. Ahmed Said",
      role: language === "ar" ? "مدير المشاريع" : "Project Manager",
      image: "/project-manager-portrait.png",
    },
    {
      name: language === "ar" ? "م. سارة محمود" : "Eng. Sara Mahmoud",
      role: language === "ar" ? "مهندسة معمارية" : "Architect",
      image: "/female-architect-portrait.png",
    },
  ]

  const features = [
    {
      icon: Award,
      title: language === "ar" ? "جودة عالية" : "High Quality",
      description: language === "ar" ? "نستخدم أفضل المواد والتقنيات" : "We use the best materials and techniques",
    },
    {
      icon: Users,
      title: language === "ar" ? "فريق محترف" : "Professional Team",
      description: language === "ar" ? "مهندسون وفنيون ذوو خبرة عالية" : "Highly experienced engineers and technicians",
    },
    {
      icon: CheckCircle2,
      title: language === "ar" ? "التزام بالمواعيد" : "On-Time Delivery",
      description:
        language === "ar" ? "نلتزم بتسليم المشاريع في الوقت المحدد" : "We commit to delivering projects on time",
    },
    {
      icon: Building2,
      title: language === "ar" ? "خبرة واسعة" : "Wide Experience",
      description: language === "ar" ? "أكثر من 15 عاماً من الخبرة" : "More than 15 years of experience",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/construction-site-background.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {language === "ar"
                ? "نبني أحلامك على أرض الواقع بأعلى معايير الجودة العالمية"
                : "Building Your Dreams with Highest International Quality Standards"}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {language === "ar"
                ? "شريكك الموثوق في تنفيذ المشاريع الإنشائية والمعمارية"
                : "Your trusted partner in construction and architectural projects"}
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              {language === "ar" ? "اطلب استشارة مجانية" : "Request Free Consultation"}
              <ArrowRight className={`h-5 w-5 ${language === "ar" ? "rotate-180" : ""}`} />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 w-full max-w-4xl"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  {language === "ar" ? "من نحن - العزب للخدمات المعمارية" : "About Us - Al-Azab Construction Services"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {language === "ar"
                    ? "شركة العزب للخدمات المعمارية هي إحدى الشركات الرائدة في مجال المقاولات والإنشاءات في مصر. نقدم خدمات متكاملة تشمل التصميم المعماري، التنفيذ، والإشراف الهندسي."
                    : "Al-Azab Construction Services is one of the leading companies in contracting and construction in Egypt. We provide integrated services including architectural design, execution, and engineering supervision."}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {language === "ar"
                    ? "نفخر بخبرتنا الممتدة لأكثر من 15 عاماً في تنفيذ مشاريع سكنية وتجارية بأعلى معايير الجودة والاحترافية."
                    : "We are proud of our experience spanning more than 15 years in executing residential and commercial projects with the highest standards of quality and professionalism."}
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  {language === "ar" ? "اعرف المزيد" : "Learn More"}
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/examples/specialized-sustainability-analyzer-original.png"
                  alt="Al-Azab Construction"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {language === "ar" ? "خدماتنا" : "Our Services"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === "ar"
                  ? "نقدم مجموعة شاملة من الخدمات الإنشائية والمعمارية"
                  : "We provide a comprehensive range of construction and architectural services"}
              </p>
            </div>
          </FadeIn>

          <StaggerIn staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <HoverCard key={index}>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                      <service.icon className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                  </div>
                </HoverCard>
              ))}
            </div>
          </StaggerIn>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {language === "ar" ? "مشاريعنا" : "Our Projects"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === "ar"
                  ? "نفخر بإنجازاتنا ومشاريعنا المتميزة"
                  : "We are proud of our achievements and distinguished projects"}
              </p>
            </div>
          </FadeIn>

          <StaggerIn staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <HoverCard key={index}>
                  <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block px-3 py-1 bg-orange-500 rounded-full text-sm mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                    </div>
                  </div>
                </HoverCard>
              ))}
            </div>
          </StaggerIn>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
            >
              {language === "ar" ? "عرض جميع المشاريع" : "View All Projects"}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "ar" ? "هل أنت مستعد لبدء مشروعك القادم؟" : "Ready to Start Your Next Project?"}
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              {language === "ar"
                ? "تواصل معنا اليوم واحصل على استشارة مجانية"
                : "Contact us today and get a free consultation"}
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              {language === "ar" ? "اتصل بنا الآن" : "Contact Us Now"}
              <Phone className="h-5 w-5" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {language === "ar" ? "آراء عملائنا" : "Client Testimonials"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === "ar" ? "ماذا يقول عملاؤنا عن خدماتنا" : "What our clients say about our services"}
              </p>
            </div>
          </FadeIn>

          <StaggerIn staggerDelay={0.15}>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <HoverCard key={index}>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">&ldquo;{testimonial.text}&rdquo;</p>
                  </div>
                </HoverCard>
              ))}
            </div>
          </StaggerIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {language === "ar" ? "لماذا تختارنا" : "Why Choose Us"}
              </h2>
            </div>
          </FadeIn>

          <StaggerIn staggerDelay={0.1}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <HoverCard key={index}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="h-10 w-10 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </HoverCard>
              ))}
            </div>
          </StaggerIn>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {language === "ar" ? "فريق العمل" : "Our Team"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === "ar" ? "تعرف على فريقنا المحترف" : "Meet our professional team"}
              </p>
            </div>
          </FadeIn>

          <StaggerIn staggerDelay={0.15}>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <HoverCard key={index}>
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{member.role}</p>
                    <div className="flex justify-center gap-3">
                      <a
                        href="#"
                        className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </HoverCard>
              ))}
            </div>
          </StaggerIn>
        </div>
      </section>

      {/* Contact & Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Stats */}
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
                  {language === "ar" ? "إحصائياتنا بالأرقام" : "Our Statistics"}
                </h2>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-end gap-4 mb-2">
                      <span className="text-5xl font-bold text-orange-500">99%</span>
                      <span className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
                        {language === "ar" ? "رضا العملاء" : "Client Satisfaction"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full" style={{ width: "99%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-end gap-4 mb-2">
                      <span className="text-5xl font-bold text-orange-500">100%</span>
                      <span className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
                        {language === "ar" ? "جودة التنفيذ" : "Execution Quality"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-end gap-4 mb-2">
                      <span className="text-5xl font-bold text-orange-500">+230</span>
                      <span className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
                        {language === "ar" ? "مشروع منجز" : "Completed Projects"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-end gap-4 mb-2">
                      <span className="text-5xl font-bold text-orange-500">+15</span>
                      <span className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
                        {language === "ar" ? "سنة خبرة" : "Years Experience"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn delay={0.2}>
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  {language === "ar" ? "هل لديك استفسار؟ تواصل معنا" : "Have a Question? Contact Us"}
                </h3>
                <form className="space-y-4">
                  <div>
                    <Input placeholder={language === "ar" ? "الاسم" : "Name"} className="bg-white dark:bg-gray-900" />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
                      className="bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder={language === "ar" ? "رقم الهاتف" : "Phone"}
                      className="bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder={language === "ar" ? "رسالتك" : "Your Message"}
                      rows={4}
                      className="bg-white dark:bg-gray-900"
                    />
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    {language === "ar" ? "إرسال" : "Send"}
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <span>+20 2 27047955</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span>info@alazab.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <span>{language === "ar" ? "القاهرة الجديدة، مصر" : "New Cairo, Egypt"}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
