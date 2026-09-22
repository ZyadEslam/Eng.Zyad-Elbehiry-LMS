"use client";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="paper grid min-h-screen place-items-center p-6">
      <div className="panel max-w-md p-8 text-center">
        <div className="eyebrow">Temporary error</div>
        <h1 className="mt-1 text-2xl font-black">حصل خطأ مؤقت في الاتصال</h1>
        <p className="mt-2 font-semibold text-[#666]">غالبًا مشكلة لحظية في قاعدة البيانات. جرّب تاني بعد ثانية.</p>
        {error.digest && <p className="tick mt-2" dir="ltr">digest: {error.digest}</p>}
        <div className="mt-5 flex justify-center gap-2"><button onClick={reset} className="btn-primary"><RotateCcw size={16} /> إعادة المحاولة</button><a href="/login" className="btn-ghost">تسجيل الدخول</a></div>
      </div>
    </main>
  );
}
