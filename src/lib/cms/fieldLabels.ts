// ترجمة عناوين الحقول في محرّر الـCMS للإنجليزية.
// الـschema بيرجع label عربي (verbose_name من Django)؛ هنا نترجم المفاتيح الشائعة،
// ونرجع null للحقول غير المعروفة فيُستخدم العربي كما هو.

// أساس الاسم (بعد إزالة لاحقة _ar/_en) → الإنجليزية
const BASE: Record<string, string> = {
  slug: "Identifier (slug)",
  name: "Name",
  title: "Title",
  subtitle: "Subtitle",
  label: "Label",
  desc: "Description",
  description: "Description",
  excerpt: "Excerpt",
  body: "Body",
  content: "Content",
  quote: "Quote",
  intro: "Introduction",
  heading: "Heading",
  tagline: "Tagline",
  cta: "Call to Action",
  cta_href: "Action button link",
  button: "Button",
  // فروع
  area: "District",
  city: "City",
  region: "Region",
  address: "Address",
  hours: "Working Hours",
  phone: "Phone Number",
  phone_evening: "Evening Phone",
  email: "Email",
  manager: "Branch Manager",
  map_url: "Map Link",
  rating: "Rating",
  reviews_count: "Reviews Count",
  services: "Services",
  // أخصائيون / وظائف
  specialty: "Specialty",
  department: "Department",
  branch: "Branch",
  experience: "Experience",
  days: "Working Days",
  type: "Type",
  requirements: "Requirements",
  responsibilities: "Responsibilities",
  // عام
  image: "Image",
  image_file: "Upload image",
  images: "Images",
  gallery: "Gallery",
  icon: "Icon",
  category: "Category",
  tag: "Tag",
  tags: "Tags",
  date: "Date",
  author: "Author",
  value: "Value",
  order: "Order",
  published: "Published",
  is_new: "New",
  featured: "Featured",
  lat: "Latitude",
  lng: "Longitude",
  url: "Link",
  link: "Link",
  color: "Color",
  count: "Count",
  number: "Number",
  stats: "Statistics",
};

const SUFFIX: Record<string, string> = { ar: " (Arabic)", en: " (English)" };

// يرجّع العنوان الإنجليزي للحقل، أو null لو غير معروف
export function fieldLabelEn(name: string): string | null {
  if (!name) return null;
  const m = name.match(/^(.*)_(ar|en)$/);
  const base = m ? m[1] : name;
  const suffix = m ? SUFFIX[m[2]] : "";
  const en = BASE[base];
  if (!en) return null;
  return en + suffix;
}

// اختيار العنوان حسب اللغة: إنجليزي إن توفّرت ترجمة، وإلا العربي (label من الـschema)
export function pickFieldLabel(lang: "ar" | "en", name: string, arLabel: string): string {
  if (lang !== "en") return arLabel;
  return fieldLabelEn(name) || arLabel;
}
