// محتوى صفحة فروعنا — مطابق لديزاين Figma (node 1:3688)
// كروت الديزاين placeholder متطابقة (فرع النرجس)؛ هنا فروع واقعية بنفس البنية.

import { type Locale } from "@/i18n/config";

export type Branch = {
  slug: string;
  name: string;
  area: string;
  city: string;
  region: string;
  address: string;
  hours: string;
  phone: string;
  phoneEvening?: string;
  email?: string;
  manager?: string;
  mapUrl?: string;
  services: string[];
  gallery?: string[];
  lat?: number | null;
  lng?: number | null;
  isNew?: boolean;
  rating?: string;
  reviewsCount?: string;
};

const HOURS = "الأحد – الخميس: ٨ص – ٨م";
const HOURS_EN = "Sunday – Thursday: 8 AM – 8 PM";

export const BRANCHES: Branch[] = [
  { slug: "narjes", name: "النرجس - فرع الرياض", area: "حي النرجس", city: "الرياض", region: "الرياض", address: "شارع أنس بن مالك، حي النرجس، الرياض ١٣٣٢١", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "تكامل حسي", "تخاطب ولغة", "التدخل المبكر"], isNew: true },
  { slug: "olaya", name: "العليا - فرع الرياض", area: "حي العليا", city: "الرياض", region: "الرياض", address: "طريق الملك فهد، حي العليا، الرياض ١٢٢١٤", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "علاج طبيعي", "تخاطب ولغة"] },
  { slug: "rawdah-ryd", name: "الروضة - فرع الرياض", area: "حي الروضة", city: "الرياض", region: "الرياض", address: "شارع خالد بن الوليد، حي الروضة، الرياض ١٣٢١١", hours: HOURS, phone: "920000109", services: ["دعم نفسي", "تحليل سلوك", "التدخل المبكر"] },
  { slug: "shati-jed", name: "الشاطئ - فرع جدة", area: "حي الشاطئ", city: "جدة", region: "جدة", address: "طريق الكورنيش، حي الشاطئ، جدة ٢٣٤١٢", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "تكامل حسي", "علاج وظيفي"], isNew: true },
  { slug: "rawdah-jed", name: "الروضة - فرع جدة", area: "حي الروضة", city: "جدة", region: "جدة", address: "شارع الأمير سلطان، حي الروضة، جدة ٢٣٤٣٤", hours: HOURS, phone: "920000109", services: ["علاج طبيعي", "تحليل سلوك", "التدخل المبكر"] },
  { slug: "khobar", name: "الخبر - فرع الشرقية", area: "حي العقربية", city: "الخبر", region: "المنطقة الشرقية", address: "طريق الملك فهد، حي العقربية، الخبر ٣٤٤٢٦", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "علاج وظيفي", "تكامل حسي"] },
  { slug: "azizia-mecca", name: "العزيزية - فرع مكة", area: "حي العزيزية", city: "مكة المكرمة", region: "مكة المكرمة", address: "شارع الحج، حي العزيزية، مكة المكرمة ٢٤٢٢٧", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "تخاطب ولغة", "التدخل المبكر"] },
  { slug: "abha", name: "المنهل - فرع أبها", area: "حي المنهل", city: "أبها", region: "عسير", address: "طريق الملك عبدالعزيز، حي المنهل، أبها ٦٢٥٢١", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "دعم نفسي", "تخاطب ولغة"], isNew: true },
];

export const BRANCHES_EN: Branch[] = [
  { slug: "narjes", name: "Al-Narjes - Riyadh Branch", area: "Al-Narjes District", city: "Riyadh", region: "Riyadh", address: "Anas Bin Malik Street, Al-Narjes District, Riyadh 13321", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Sensory Integration", "Speech & Language Therapy", "Early Intervention"], isNew: true },
  { slug: "olaya", name: "Al-Olaya - Riyadh Branch", area: "Al-Olaya District", city: "Riyadh", region: "Riyadh", address: "King Fahd Road, Al-Olaya District, Riyadh 12214", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Physical Therapy", "Speech & Language Therapy"] },
  { slug: "rawdah-ryd", name: "Al-Rawdah - Riyadh Branch", area: "Al-Rawdah District", city: "Riyadh", region: "Riyadh", address: "Khalid Bin Al-Walid Street, Al-Rawdah District, Riyadh 13211", hours: HOURS_EN, phone: "920000109", services: ["Psychological Services", "Applied Behavior Analysis", "Early Intervention"] },
  { slug: "shati-jed", name: "Al-Shati - Jeddah Branch", area: "Al-Shati District", city: "Jeddah", region: "Jeddah", address: "Corniche Road, Al-Shati District, Jeddah 23412", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Sensory Integration", "Occupational Therapy"], isNew: true },
  { slug: "rawdah-jed", name: "Al-Rawdah - Jeddah Branch", area: "Al-Rawdah District", city: "Jeddah", region: "Jeddah", address: "Prince Sultan Street, Al-Rawdah District, Jeddah 23434", hours: HOURS_EN, phone: "920000109", services: ["Physical Therapy", "Applied Behavior Analysis", "Early Intervention"] },
  { slug: "khobar", name: "Al-Khobar - Eastern Province Branch", area: "Al-Aqrabiyah District", city: "Al-Khobar", region: "Eastern Province", address: "King Fahd Road, Al-Aqrabiyah District, Al-Khobar 34426", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Occupational Therapy", "Sensory Integration"] },
  { slug: "azizia-mecca", name: "Al-Azizia - Makkah Branch", area: "Al-Azizia District", city: "Makkah", region: "Makkah", address: "Al-Hajj Street, Al-Azizia District, Makkah 24227", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Speech & Language Therapy", "Early Intervention"] },
  { slug: "abha", name: "Al-Manhal - Abha Branch", area: "Al-Manhal District", city: "Abha", region: "Asir", address: "King Abdulaziz Road, Al-Manhal District, Abha 62521", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Psychological Services", "Speech & Language Therapy"], isNew: true },
];

// فروع إقليمية إضافية (تظهر في صفحة "من نحن" ولها صفحات تفاصيل)
export const REGION_BRANCHES: Branch[] = [
  { slug: "kharj", name: "فرع الخرج", area: "حي الناصرية", city: "الخرج", region: "الرياض", address: "طريق الملك عبدالعزيز، حي الناصرية، الخرج", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "تحليل سلوك", "التدخل المبكر"] },
  { slug: "wadi-dawasir", name: "فرع وادي الدواسر", area: "حي الفيصلية", city: "وادي الدواسر", region: "الرياض", address: "الطريق العام، حي الفيصلية، وادي الدواسر", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "تخاطب ولغة"] },
  { slug: "qassim", name: "فرع القصيم", area: "حي الصفراء", city: "القصيم", region: "القصيم", address: "طريق الملك فهد، حي الصفراء، بريدة", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "تكامل حسي", "تخاطب ولغة"] },
  { slug: "majmaah", name: "فرع المجمعة", area: "حي العزيزية", city: "المجمعة", region: "الرياض", address: "طريق الملك سلمان، حي العزيزية، المجمعة", hours: HOURS, phone: "920000109", services: ["علاج طبيعي", "علاج وظيفي"] },
  { slug: "sharqia", name: "فرع الشرقية", area: "حي الفيصلية", city: "الشرقية", region: "المنطقة الشرقية", address: "طريق الملك فهد، حي الفيصلية، الدمام", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "علاج وظيفي", "دعم نفسي"] },
  { slug: "jouf", name: "فرع الجوف", area: "حي الفيصلية", city: "الجوف", region: "الجوف", address: "طريق الملك عبدالله، حي الفيصلية، سكاكا", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "التدخل المبكر"] },
  { slug: "madinah", name: "فرع المدينة المنورة", area: "حي العزيزية", city: "المدينة المنورة", region: "المدينة المنورة", address: "طريق الملك عبدالعزيز، حي العزيزية، المدينة المنورة", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "علاج وظيفي", "تكامل حسي"] },
  { slug: "taif", name: "فرع الطائف", area: "حي شهار", city: "الطائف", region: "مكة المكرمة", address: "طريق الملك فيصل، حي شهار، الطائف", hours: HOURS, phone: "920000109", services: ["علاج طبيعي", "تحليل سلوك"] },
  { slug: "aseer", name: "فرع عسير", area: "حي المنسك", city: "عسير", region: "عسير", address: "طريق الملك عبدالعزيز، حي المنسك، أبها", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "دعم نفسي", "تخاطب ولغة"] },
];

export const REGION_BRANCHES_EN: Branch[] = [
  { slug: "kharj", name: "Al-Kharj Branch", area: "Al-Nasiriyah District", city: "Al-Kharj", region: "Riyadh", address: "King Abdulaziz Road, Al-Nasiriyah District, Al-Kharj", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Applied Behavior Analysis", "Early Intervention"] },
  { slug: "wadi-dawasir", name: "Wadi Al-Dawasir Branch", area: "Al-Faisaliyah District", city: "Wadi Al-Dawasir", region: "Riyadh", address: "Main Road, Al-Faisaliyah District, Wadi Al-Dawasir", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Speech & Language Therapy"] },
  { slug: "qassim", name: "Qassim Branch", area: "Al-Safra District", city: "Qassim", region: "Qassim", address: "King Fahd Road, Al-Safra District, Buraidah", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Sensory Integration", "Speech & Language Therapy"] },
  { slug: "majmaah", name: "Al-Majmaah Branch", area: "Al-Azizia District", city: "Al-Majmaah", region: "Riyadh", address: "King Salman Road, Al-Azizia District, Al-Majmaah", hours: HOURS_EN, phone: "920000109", services: ["Physical Therapy", "Occupational Therapy"] },
  { slug: "sharqia", name: "Eastern Province Branch", area: "Al-Faisaliyah District", city: "Eastern Province", region: "Eastern Province", address: "King Fahd Road, Al-Faisaliyah District, Dammam", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Occupational Therapy", "Psychological Services"] },
  { slug: "jouf", name: "Al-Jouf Branch", area: "Al-Faisaliyah District", city: "Al-Jouf", region: "Al-Jouf", address: "King Abdullah Road, Al-Faisaliyah District, Sakaka", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Early Intervention"] },
  { slug: "madinah", name: "Madinah Branch", area: "Al-Azizia District", city: "Madinah", region: "Madinah", address: "King Abdulaziz Road, Al-Azizia District, Madinah", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Occupational Therapy", "Sensory Integration"] },
  { slug: "taif", name: "Taif Branch", area: "Shihar District", city: "Taif", region: "Makkah", address: "King Faisal Road, Shihar District, Taif", hours: HOURS_EN, phone: "920000109", services: ["Physical Therapy", "Applied Behavior Analysis"] },
  { slug: "aseer", name: "Asir Branch", area: "Al-Mansak District", city: "Asir", region: "Asir", address: "King Abdulaziz Road, Al-Mansak District, Abha", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Psychological Services", "Speech & Language Therapy"] },
];

// قائمة الخدمات العامة الموحّدة (احتياطي — مطابقة لبيانات الـCMS)
const DEF_SERVICES = ["التدخل المبكر", "تخاطب ولغة", "علاج وظيفي", "تكامل حسي", "تعديل سلوك"];

// كل الفروع الحقيقية (43) — تُستخدم كنسخة احتياطية لو تعذّر جلبها من الـCMS، حتى لا يظهر عدد/بيانات قديمة
export const ALL_BRANCHES: Branch[] = [
  { slug: "branch-1", name: "مركز فرع عبور العزيزية  للرعاية النهارية", area: "", city: "العزيزية", region: "الرياض", address: "منطقة الرياض - حي العزيزية - طريق النصر", hours: "", phone: "555608695", phoneEvening: "579844998", email: "Oboor.alaziziyah@hdc.edu.sa", manager: "أ. مريم العليقي", mapUrl: "https://maps.app.goo.gl/vjQqr1vtw7L9AeZUA?g_st=iw", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-2", name: "مركز فرع  عبور نمار  للرعاية النهارية", area: "", city: "نمار", region: "الرياض", address: "منطقة الرياض - حي نمار - طريق نجم الدين", hours: "", phone: "553990209", phoneEvening: "556550932", email: "oboor.nemar@hdc.edu.sa", manager: "أ. أميرة عيضة المالكي", mapUrl: "https://maps.app.goo.gl/xRzvZw1FA45C5wLi9?g_st=iw", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-3", name: "مركز فرع عبور ظهرة لبن  للرعاية النهارية", area: "", city: "ظهرة لبن", region: "الرياض", address: "منطقة الرياض - حي ظهرة لبن - شارع نجران", hours: "", phone: "555259611", phoneEvening: "536487581", email: "rep.labn@hdc.edu.sa", manager: "أ.العنود القحطاني", mapUrl: "https://maps.app.goo.gl/4KkiUUU5GcQcua6C9?g_st=iw", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-4", name: "مركز فرع عبور الروضة  للرعاية النهارية", area: "", city: "الروضة", region: "الرياض", address: "منطقة الرياض - حي الروضه - مخرج 11 طريق الدائري الشرقي", hours: "", phone: "555256411", phoneEvening: "555032398", email: "oboor.rawda@hdc.edu.sa", manager: "أ.اماني الشهري", mapUrl: "https://maps.app.goo.gl/ETWVnEcu7qbjMzeT8?g_st=iw", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-5", name: "مركز فرع عبور المعيزلية  للرعاية النهارية", area: "", city: "المعيزلية", region: "الرياض", address: "منطقة الرياض - حي المعيزلية - شارع فنون", hours: "", phone: "553553209", phoneEvening: "541012037", email: "almaizilah@hdc.edu.sa", manager: "أ. مها مبارك ال شوغب", mapUrl: "https://maps.app.goo.gl/QAPwtSzhtkthnWfR7?g_st=ipc", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-6", name: "مركز  فرع عبور  النرجس  للرعاية النهارية", area: "", city: "النرجس", region: "الرياض", address: "منطقة الرياض - حي النرجس - شارع الأمير سعود بن عبدالله الجلوي", hours: "", phone: "555258611", phoneEvening: "555257611", email: "oboor.alnarjis@hdc.edu.sa", manager: "أ. أسيل سعود الراشد", mapUrl: "https://maps.app.goo.gl/exrTahmyTdiGfLdW8", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-7", name: "مركز فرع عبور الملقا  للرعاية النهارية", area: "", city: "الملقا", region: "الرياض", address: "منطقة الرياض- الملقا -وادي وج،، الرياض", hours: "", phone: "550287769", phoneEvening: "", email: "oboor.almalqa@hdc.edu.sa", manager: "أ. لطيفة الصالح", mapUrl: "https://maps.app.goo.gl/RfbfXbniNNEa4qxq6", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-8", name: "مركز عبور المرسلات للرعاية النهارية", area: "", city: "المرسلات", region: "الرياض", address: "الرياض - حي المرسلات", hours: "", phone: "553642443", phoneEvening: "", email: "almursalat@hdc.edu.sa", manager: "أ.رجاء سعد القحطاني", mapUrl: "https://maps.app.goo.gl/B5v2cjGSHRj2SzVm6?g_st=ipc", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-9", name: "مركز عبور السلام للرعاية النهارية", area: "", city: "السلام", region: "الرياض", address: "الرياض - حي السلام", hours: "", phone: "533130590", phoneEvening: "", email: "alsalam@hdc.edu.sa", manager: "أ. شذى العصيمي", mapUrl: "https://maps.app.goo.gl/itJBiVWSqFYipxQq8?g_st=ipc", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-10", name: "مركز فرع عبور المجمعة  للرعاية النهارية", area: "", city: "المجمعة", region: "الرياض", address: "محافظة المجمعة - حي الملك عبد الله - شارع الأمير ثنيان بن سعود", hours: "", phone: "555124126", phoneEvening: "553256406", email: "Majmaah@hdc.com.sa", manager: "أ.نورة العيباني", mapUrl: "https://maps.app.goo.gl/gueMettMzW1tzswo8?g_st=ic", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-11", name: "مركز  فرع عبور وادي الدواسر للرعاية النهارية", area: "", city: "وادي الدواسر", region: "الرياض", address: "طريق دله - حي الورود", hours: "", phone: "500029085", phoneEvening: "", email: "wadi.dwasr@hdc.com.sa", manager: "أ.عبير مرزوق", mapUrl: "https://maps.app.goo.gl/LL2SdCSxwqt9Snuy8", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-12", name: "مركز  فرع عبور النرجس جنوب الملك سلمان للرعاية النهارية", area: "", city: "النرجس جنوب الملك سلمان", region: "الرياض", address: "الرياض  النرجس، طريق الأمير فيصل بن بندر بن عبدالعزيز،", hours: "", phone: "535162373", phoneEvening: "", email: "oboor.alnarjis2@hdc.edu.sa", manager: "أ.أشواق المعمر", mapUrl: "https://maps.app.goo.gl/eZS6ecmU2zp1UH8T7", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-13", name: "مركز  فرع عبور العريجاء  للرعاية النهارية", area: "", city: "العريجاء", region: "الرياض", address: "الرياض  العريجاء الوسطى، طريق الامير مساعد بن عبدالرحمن بن فيصل،", hours: "", phone: "539803371", phoneEvening: "573653319", email: "oboor.aluraija@hdc.edu.sa", manager: "أ.بجداء الهدباني", mapUrl: "https://maps.app.goo.gl/C4mHokcmd2YLTrJi7", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-14", name: "مركز  فرع عبور بريدة للرعاية النهارية", area: "", city: "بريدة", region: "القصيم", address: "منطقة القصيم - مدينة بريدة - حي النهضة - شارع أبي بكر الصديق", hours: "", phone: "500614855", phoneEvening: "551143188", email: "qassim@hdc.com.sa", manager: "أ.أمجاد الحربي", mapUrl: "https://maps.app.goo.gl/RAK9nwS5gcpKDKts9?g_st=ipc", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-15", name: "مركز  فرع عبور الرس  للرعاية النهارية", area: "", city: "الرس", region: "القصيم", address: "منطقة القصيم - محافظة الرس - حي السعادة - شارع عبدالرحمن بن عوف", hours: "", phone: "555015057", phoneEvening: "", email: "oboor.alrass@hdc.edu.sa", manager: "أ.ندى الحربي", mapUrl: "https://maps.google.com/?q=25.867300,43.486900", services: DEF_SERVICES, lat: 25.8673, lng: 43.4869, isNew: false },
  { slug: "branch-16", name: "مركز  فرع عبور محايل عسير للرعاية النهارية", area: "", city: "محايل عسير", region: "عسير", address: "منطقة عسير  -محايل عسير -  الوعد،", hours: "", phone: "532865692", phoneEvening: "", email: "muhayil.asir@hdc.com.sa", manager: "أ.شمعة دعبش", mapUrl: "https://maps.google.com/?q=18.564400,42.066509", services: DEF_SERVICES, lat: 18.5644, lng: 42.066509, isNew: false },
  { slug: "branch-17", name: "مركز  فرع عبور بيشة  للرعاية النهارية", area: "", city: "بيشة", region: "عسير", address: "منطقة عسير - محافظة بيشة - حي الخزامى - طريق الملك سعود", hours: "", phone: "500552192", phoneEvening: "", email: "besha@hdc.com.sa", manager: "بدرية المعاوي", mapUrl: "https://maps.app.goo.gl/QugRbwMHHphDCnCS8?g_st=ipc", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-18", name: "مركز  فرع عبور  خميس مشيط للرعاية النهارية", area: "", city: "خميس مشيط", region: "عسير", address: "فرع خميس مشيط طريق الضيافة – شارع صلاح الدين مقابل قاعة المملكة", hours: "", phone: "500051865", phoneEvening: "500052543", email: "aseer@hdc.com.sa", manager: "أ.بدرية مرعي سعيد السرحاني", mapUrl: "https://maps.app.goo.gl/TbsdVU9m3H8k9wAG6", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-19", name: "مركز  فرع عبور  أبها للرعاية النهارية", area: "", city: "أبها", region: "عسير", address: "ابها - حي الخالدية، - طريق سرد بن عبدالله الازدي،", hours: "", phone: "550842755", phoneEvening: "", email: "oboor.abha.female@hdc.edu.sa", manager: "أ.نوال القحطاني", mapUrl: "https://maps.app.goo.gl/xjTtVXsH4UDa9pCu9", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-20", name: "مركز  فرع عبور  جازان للرعاية النهارية", area: "", city: "جازان", region: "جازان", address: "جازان  - حي السويس -بشر النصيبي،", hours: "", phone: "555264409", phoneEvening: "555218447", email: "jazan@hdc.com.sa", manager: "أ.رنيم عمر", mapUrl: "https://maps.app.goo.gl/79ARN1oWmSYNg2Fh9?g_st=ic", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-21", name: "مركز  فرع عبور الإحساء فرع شركة تأهيل الإنسان", area: "", city: "الإحساء شركة تأهيل الإنسان", region: "الشرقية", address: "المنطقة الشرقية - محافظة الأحساء - حي العليا - الشارع العام", hours: "", phone: "500585534", phoneEvening: "530464336/534676192", email: "alahsa@hdc.com.sa", manager: "أ.مها صالح الطيبان", mapUrl: "https://maps.google.com/?q=25.360624,49.590900", services: DEF_SERVICES, lat: 25.360624, lng: 49.5909, isNew: false },
  { slug: "branch-22", name: "مركز عبور الإحساء VIP للرعاية النهارية", area: "", city: "الإحساء VIP", region: "الشرقية", address: "المنطقة الشرقية - اسماء بنت خارجه،  ، حي محاسن ارامكو الثاني، المبرز", hours: "", phone: "573824660", phoneEvening: "", email: "", manager: "أ. العنود الرويشد", mapUrl: "https://maps.app.goo.gl/msK8DRkaT2QuSAeKA", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-23", name: "مركز  فرع عبور النعيرية للرعاية النهارية", area: "", city: "النعيرية", region: "الشرقية", address: "المنطقة الشرقية - محافظة النعيرية - حي الربيع - شارع ابو جعفر المنصور", hours: "", phone: "532862122", phoneEvening: "", email: "Nariyah@hdc.com.sa", manager: "أ.خلود العتيبي", mapUrl: "https://maps.app.goo.gl/2JpU2wSrPR6EnESX6?g_st=ipc", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-24", name: "مركز  فرع عبور حفر الباطن للرعاية النهارية", area: "", city: "حفر الباطن", region: "الشرقية", address: "المنطقة الشرقية - محافظة حفر الباطن - حي الخالدية - شارع عام", hours: "", phone: "555604098", phoneEvening: "", email: "hafarAlBatin@hdc.edu.sa", manager: "أ.وفاء مدعث السهلي", mapUrl: "https://maps.google.com/?q=28.423599,45.970692", services: DEF_SERVICES, lat: 28.423599, lng: 45.970692, isNew: false },
  { slug: "branch-25", name: "مركز  فرع عبور  الدمام  للرعاية النهارية", area: "", city: "الدمام", region: "الشرقية", address: "المنطقة الشرقية - مدينة الدمام - حي النورس - شارع الزهرة", hours: "", phone: "556565599", phoneEvening: "", email: "oboor.alkhobar@hdc.edu.sa", manager: "أ. سجى", mapUrl: "https://maps.app.goo.gl/Dqyw2GHDwcjVRrV26?g_st=ic", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-26", name: "مركز  فرع عبور الجبيل للرعاية النهارية", area: "", city: "الجبيل", region: "الشرقية", address: "الجبيل ، حي الفناتير", hours: "", phone: "538301550", phoneEvening: "", email: "oboor.aljubail@hdc.edu.sa", manager: "أ.خلود الطويل", mapUrl: "https://maps.app.goo.gl/sbXdYBp5BvxSPQcq9?g_st=com.google.maps.preview.copy", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-27", name: "مركز  فرع عبور الخبر للرعاية النهارية", area: "", city: "الخبر", region: "الشرقية", address: "الخبر ,العقربية,شارع الشورى", hours: "", phone: "536412822", phoneEvening: "", email: "", manager: "أ.منال الدوسري", mapUrl: "https://maps.app.goo.gl/aDd7nhhG3WxGLsQk6", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-28", name: "مركز فرع عبور الطائف  للرعاية النهارية", area: "", city: "الطائف", region: "مكة المكرمة", address: "منطقة مكة المكرمة - محافظة الطائف - حي الشرفية - شارع عام", hours: "", phone: "503072539", phoneEvening: "", email: "Oboor.altaif@hdc.edu.sa", manager: "أ.مثايل الحازمي", mapUrl: "https://goo.gl/maps/iGET6tB1aKbnXt1W8", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-29", name: "مركز عبور مكة المكرمه للرعاية النهارية", area: "", city: "مكة المكرمه", region: "مكة المكرمة", address: "منطقة مكة المكرمة -حي الشوقية", hours: "", phone: "557288714", phoneEvening: "", email: "oboor.makkah@hdc.edu.sa", manager: "أ.حنان عبدالله المنبهي", mapUrl: "https://maps.app.goo.gl/A5A7okajDucAxskm7?g_st=ic", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-30", name: "مركز  فرع عبور المدينة المنورة للرعاية النهارية", area: "", city: "المدينة المنورة", region: "المدينة المنورة", address: "حي بئر عثمان  - شارع رافع بن جعدبه", hours: "", phone: "550335136", phoneEvening: "", email: "oboor.madinah@hdc.edu.sa", manager: "أ.شادية ناير الحربي", mapUrl: "https://maps.app.goo.gl/k8i3EL2T8vVY97Ze6?g_st=ic", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-31", name: "مركز  فرع عبور الجوف للرعاية النهارية", area: "", city: "الجوف", region: "الجوف", address: "سكاكا   حي العزيزية، طريق الملك خالد", hours: "", phone: "557450796", phoneEvening: "", email: "oboor.aljouf@hdc.edu.sa", manager: "أ.ديمة الكويكبي", mapUrl: "https://maps.app.goo.gl/9SVVHe4Sj9tjzo2B9", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-32", name: "مركز  فرع عبور شباب الإحساء  للرعاية النهارية", area: "", city: "الإحساء", region: "الشرقية", address: "أبو الطوق، ، حي الحزم الجنوبي، المبرز", hours: "", phone: "550839355", phoneEvening: "", email: "oboor.alahsa@hdc.edu.sa", manager: "أ.عمر الخميس", mapUrl: "https://maps.app.goo.gl/pRXU9og9pboxt56P7?g_st=iw", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-33", name: "مركز  فرع عبور شباب النعيرية  للرعاية النهارية", area: "", city: "النعيرية", region: "الشرقية", address: "المنطقة الشرقية - محافظة النعيرية - حي الربيع - شارع ابو جعفر المنصور", hours: "", phone: "507857650", phoneEvening: "", email: "Nariyah@hdc.com.sa", manager: "أ.خلود العتيبي", mapUrl: "https://maps.app.goo.gl/PCLt642jTCS3L8KG8?g_st=com.google.maps.preview.copy", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-34", name: "مركز  فرع عبور  شباب الدمام  للرعاية النهارية", area: "", city: "الدمام", region: "الشرقية", address: "الدمام  -حي بدر - ضياء الدين البشيري", hours: "", phone: "539813713", phoneEvening: "", email: "oboor.aldammam.male@hdc.edu.sa", manager: "عمار  بن  مكي", mapUrl: "https://maps.app.goo.gl/vvxLzetaLmtpEZ3FA", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-35", name: "مركز فرع عبور شباب المجمعة  للرعاية النهارية", area: "", city: "المجمعة", region: "الرياض", address: "المجمعة  حي الملك عبدالعزيز، شارع عبيدة بن الحارث", hours: "", phone: "550842055", phoneEvening: "", email: "oboor.almajmaah@hdc.edu.sa", manager: "أ.خالد العصيمي", mapUrl: "https://maps.app.goo.gl/D45Led11HaJJbT9i8", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-36", name: "مركز  فرع عبور شباب  الرمال  للرعاية النهارية", area: "", city: "الرمال", region: "الرياض", address: "الرياض - حي الرمال", hours: "", phone: "536793343", phoneEvening: "", email: "oboor.alrimal.male@hdc.edu.sa", manager: "أ.عادل تركي بن طنف العتيبي", mapUrl: "https://maps.app.goo.gl/ARUGRBVQKxZJ6aBo8?g_st=com.google.maps.preview.copy", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-37", name: "مركز  فرع عبور شباب ابها  للرعاية النهارية", area: "", city: "ابها", region: "عسير", address: "طريق سرد بن عبدالله الازدي، ، حي الخالدية،", hours: "", phone: "550819655", phoneEvening: "", email: "oboor.abha.male@hdc.edu.sa", manager: "أ.محمد العمري", mapUrl: "https://maps.app.goo.gl/TtfFEJeqGGVPNdZt5", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-38", name: "مركز عبور شباب خميس مشيط للرعاية النهارية", area: "", city: "خميس مشيط", region: "عسير", address: "طريق ابها، خميس مشيط", hours: "", phone: "558678323", phoneEvening: "", email: "oboor.kamis.male@hdc.edu.sa", manager: "أ.فهد فايز الشهري", mapUrl: "https://maps.app.goo.gl/p95AzKMezQbNtYDQ6", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-39", name: "مركز  فرع عبور شباب جنوب ابها  للرعاية النهارية", area: "", city: "جنوب ابها", region: "عسير", address: "أبها - قرى آل غليظ- بالقرب من طريق مرحباً ألف", hours: "", phone: "573627990", phoneEvening: "", email: "oboor.abha.male2@hdc.edu.sa", manager: "أ.عزام عامر أبوعلام", mapUrl: "https://maps.app.goo.gl/m57fkc2fZUjdtV8A7", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-40", name: "مركز  فرع عبور شباب جازان  للرعاية النهارية", area: "", city: "جازان", region: "جازان", address: "بشر النصيبي، حي السويس جازان", hours: "", phone: "538276550", phoneEvening: "", email: "oboor.jazan.male@hdc.edu.sa", manager: "أ.تركي بن علي", mapUrl: "https://maps.app.goo.gl/79ARN1oWmSYNg2Fh9?g_st=ic", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-41", name: "مركز  فرع شباب محايل عسير للرعاية النهارية", area: "", city: "محايل عسير", region: "عسير", address: "محايل عسير - حي الوعد،", hours: "", phone: "538345501", phoneEvening: "", email: "oboor.asir.male@hdc.edu.sa", manager: "أ. سعود الغرازي", mapUrl: "https://maps.app.goo.gl/HwbBtbB6MvZESXG3A", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-42", name: "مركز   فرع عبور شباب الجوف  للرعاية النهارية", area: "", city: "الجوف", region: "الجوف", address: "سكاكا -الربوة", hours: "", phone: "534198732", phoneEvening: "", email: "oboor.aljouf.male@hdc.edu.sa", manager: "أ.عبدالعزيز السياط", mapUrl: "https://maps.app.goo.gl/TmuxT18CS4rh7Umf9?g_st=com.google.maps.preview.copy", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
  { slug: "branch-43", name: "مركز   فرع عبور شباب العريجاء  للرعاية النهارية", area: "", city: "العريجاء", region: "الرياض", address: "الرياض  العريجاء الوسطى، طريق الامير مساعد بن عبدالرحمن بن فيصل،", hours: "", phone: "551920536", phoneEvening: "", email: "oboor.aluraija.male@hdc.edu.sa", manager: "أ.راكان عبدالله الضرغام", mapUrl: "https://maps.app.goo.gl/j5BbNp299tg1NTYQA", services: DEF_SERVICES, lat: null, lng: null, isNew: false },
];
// أسماء المناطق بالإنجليزية (البيانات عربية فقط؛ نترجم المنطقة للعرض/التجميع في الوضع الإنجليزي)
export const REGION_EN: Record<string, string> = {
  "الرياض": "Riyadh",
  "مكة المكرمة": "Makkah",
  "المدينة المنورة": "Madinah",
  "الشرقية": "Eastern Province",
  "القصيم": "Qassim",
  "عسير": "Asir",
  "جازان": "Jazan",
  "الجوف": "Al-Jouf",
};
// النسخة الإنجليزية للنسخة الاحتياطية: نترجم المنطقة فقط (الأسماء/العناوين تبقى بالعربية كأسماء علم)
export const ALL_BRANCHES_EN: Branch[] = ALL_BRANCHES.map((b) => ({ ...b, region: REGION_EN[b.region] || b.region }));

export function getBranch(slug: string, locale: Locale = "ar"): Branch | undefined {
  const source = locale === "en" ? ALL_BRANCHES_EN : ALL_BRANCHES;
  return source.find((b) => b.slug === slug);
}

// تبويبات تصفية المنطقة محسوبة من قائمة فروع مُمرّرة (CMS أو ثابتة)
export function regionTabsFrom(source: Branch[], locale: Locale = "ar"): { name: string; count: number }[] {
  const allLabel = locale === "en" ? "All" : "الكل";
  const counts: Record<string, number> = {};
  for (const b of source) counts[b.region] = (counts[b.region] || 0) + 1;
  return [{ name: allLabel, count: source.length }, ...Object.entries(counts).map(([name, count]) => ({ name, count }))];
}

// تبويبات تصفية المنطقة (تُحسب من الفروع الثابتة)
export function regionTabs(locale: Locale = "ar"): { name: string; count: number }[] {
  return regionTabsFrom(locale === "en" ? BRANCHES_EN : BRANCHES, locale);
}

// مناطق خريطة الفروع (الليجند) — تُشتقّ من الفروع الفعلية مع لون لكل منطقة.
// تُستخدم في صفحتَي الفروع والتواصل لتظل الخريطة متطابقة دائماً مع الفروع.
const MAP_REGION_PALETTE = ["#2cbcc8", "#f59e0b", "#8b5cf6", "#ec4899", "#10b981", "#3b82f6", "#ef4444", "#eab308"];

// خيارات منسدلة الفروع مجمّعة حسب المنطقة (لتسهيل اختيار الفرع من بين عشرات الفروع).
// القيمة = اسم الفرع (كما يُرسَل في النماذج)، و group = المنطقة (رأس المجموعة).
export function branchSelectOptions(source: Branch[]): { value: string; label: string; group: string }[] {
  const order: string[] = [];
  const byRegion: Record<string, Branch[]> = {};
  for (const b of source) {
    const g = b.region || b.city || "";
    if (!(g in byRegion)) { byRegion[g] = []; order.push(g); }
    byRegion[g].push(b);
  }
  order.sort((a, b) => byRegion[b].length - byRegion[a].length); // الأكبر أولاً
  return order.flatMap((g) => byRegion[g].map((b) => ({ value: b.name, label: b.name, group: g })));
}

export function mapRegionsFrom(source: Branch[]): { name: string; count: number; color: string }[] {
  const order: string[] = [];
  const counts: Record<string, number> = {};
  for (const b of source) {
    const name = b.region || b.city;
    if (!name) continue;
    if (!(name in counts)) order.push(name);
    counts[name] = (counts[name] || 0) + 1;
  }
  return order
    .sort((a, b) => counts[b] - counts[a])
    .map((name, i) => ({ name, count: counts[name], color: MAP_REGION_PALETTE[i % MAP_REGION_PALETTE.length] }));
}

// مفتاح المناطق في الخريطة (أرقام تعريفية كما في الديزاين)
export const MAP_REGIONS = [
  { name: "الرياض", count: 8, color: "#2cbcc8" },
  { name: "مكة المكرمة", count: 8, color: "#f59e0b" },
  { name: "المنطقة الشرقية", count: 4, color: "#8b5cf6" },
  { name: "المدينة المنورة", count: 4, color: "#ec4899" },
  { name: "عسير", count: 3, color: "#10b981" },
  { name: "جدة", count: 3, color: "#3b82f6" },
  { name: "تبوك", count: 2, color: "#ef4444" },
];

export const MAP_REGIONS_EN = [
  { name: "Riyadh", count: 8, color: "#2cbcc8" },
  { name: "Makkah", count: 8, color: "#f59e0b" },
  { name: "Eastern Province", count: 4, color: "#8b5cf6" },
  { name: "Madinah", count: 4, color: "#ec4899" },
  { name: "Asir", count: 3, color: "#10b981" },
  { name: "Jeddah", count: 3, color: "#3b82f6" },
  { name: "Tabuk", count: 2, color: "#ef4444" },
];

export const BRANCH_FEATURES = [
  { title: "بيئةٌ مهيأة", desc: "مرافقُ مجهزةٌ بأحدث أدوات التأهيل والتقييم.", icon: "building" },
  { title: "العائلةُ في صلب التأهيل", desc: "نحرصُ على وجودكم معنا لنشاركّكم كل خطوة ونجاح.", icon: "heart" },
  { title: "برامجُ معتمدة", desc: "رحلةٌ تأهيليةٌ مدروسة، تُبنى على أسسٍ علميةٍ موثوقة.", icon: "shield" },
  { title: "روّادٌ متخصصون", desc: "نخبةٌ من الأخصائيين، يجمعون بين المعرفة التخصصية، والقدرة على استيعاب حاجة كل طفلٍ بدقة.", icon: "graduation" },
];

export const BRANCH_FEATURES_EN = [
  { title: "Prepared Environment", desc: "Facilities equipped with the latest rehabilitation and assessment tools.", icon: "building" },
  { title: "Family at the Core of Care", desc: "We ensure your presence at every step, sharing every progress and achievement.", icon: "heart" },
  { title: "Accredited Programs", desc: "Structured rehabilitation journeys built on trusted scientific foundations.", icon: "shield" },
  { title: "Specialized Pioneers", desc: "A team of experts combining professional knowledge with a precise understanding of each child's needs.", icon: "graduation" },
];
