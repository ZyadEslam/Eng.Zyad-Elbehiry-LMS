import Link from "next/link";
export default function NF() { return <main className="paper grid min-h-screen place-items-center"><div className="text-center"><div className="mono text-[96px] font-black leading-none text-brand">404</div><p className="mt-2 font-extrabold">الصفحة غير موجودة</p><Link href="/dashboard" className="btn-dark mt-5">الرجوع للجلسات</Link></div></main>; }
