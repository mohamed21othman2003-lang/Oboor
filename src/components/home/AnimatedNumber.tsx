// مؤقّتًا (بطلب المستخدم للاختبار): الأرقام تُعرض ثابتة بدون عدّاد متحرّك.
// للرجوع لاحقًا: استرجع نسخة العدّاد المتحرّك (IntersectionObserver + requestAnimationFrame).
export default function AnimatedNumber({ value }: { value: string; duration?: number }) {
  return <span>{value}</span>;
}
