// ===== أنواع لوحة التحكّم (CMS) =====
// كل شيء مبني على هذه التعريفات: الحقول، المجموعات، والإعدادات.

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "icon" // اختيار أيقونة من المجموعة
  | "color"
  | "list" // قائمة نصوص
  | "select"
  | "number"
  | "boolean";

export type Field = {
  key: string;
  label: string; // اسم الحقل بالعربي
  type: FieldType;
  bilingual?: boolean; // له نسخة عربي + إنجليزي
  options?: string[]; // لقوائم الاختيار
  help?: string; // تلميح
  colSpan?: 1 | 2; // عرض الحقل في الشبكة
};

export type Collection = {
  key: string; // المعرّف في الرابط /admin/[key]
  label: string; // الاسم بالعربي (جمع)
  labelEn: string;
  singular: string; // مفرد، مثل "برنامج"
  icon: string; // مفتاح أيقونة
  group: string; // تصنيف في القائمة الجانبية
  titleField: string; // الحقل المستخدم كعنوان الصف
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
  seed: Entry[];
};

// قيمة الحقل: نص بسيط، أو {ar,en}، أو قائمة {ar,en}، أو قائمة نصوص
export type Bilingual = { ar: string; en: string };
export type FieldValue = string | number | boolean | Bilingual | string[] | Bilingual[];
export type Entry = { id: string } & Record<string, FieldValue>;

export type SettingsGroup = {
  key: string;
  label: string;
  icon: string;
  category: "pages" | "global"; // تصنيف في القائمة الجانبية
  sections: { key: string; label: string; fields: Field[]; value: Record<string, FieldValue> }[];
};
