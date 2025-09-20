import { generateSEOTags, defaultSEO } from "@/lib/seo"
import ClientHome from "./client-page"

export const metadata = generateSEOTags({
  ...defaultSEO,
  title: "شركة العزب للإنشاءات - الرئيسية | Al-Azab Construction",
  description:
    "شركة رائدة في مجال البناء والإنشاءات في مصر. نقدم خدمات البناء السكني والتجاري والصناعي بأعلى معايير الجودة والأمان. احصل على استشارة مجانية اليوم.",
})

export default function HomePage() {
  return <ClientHome />
}
