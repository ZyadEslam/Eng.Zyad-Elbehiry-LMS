# منصة البرمجة والذكاء الاصطناعي — Grade 11 LMS
**Eng. Zyad Elbehiry** · Next.js 15 · TypeScript · Tailwind · GSAP · Prisma · JWT Auth

منصة تعليمية كاملة لـ 14 جلسة (249 شريحة تفاعلية متحركة) مع تسجيل دخول محلي، تتبع تقدم كل طالب، ومعرفة من متصل الآن.

---

## المميزات
| الميزة | التفاصيل |
|---|---|
| 🔐 مصادقة محلية | `bcrypt` + JWT موقّع في كوكي `httpOnly` (7 أيام). لا يوجد تسجيل ذاتي — المدير فقط يضيف الحسابات |
| 👑 أدوار | `ADMIN` (أنت) / `STUDENT`. `middleware.ts` يحمي كل الصفحات و `/api/*` |
| 📊 تتبع التقدم | لكل جلسة: آخر شريحة، أقصى شريحة، مكتملة؟، **الوقت المقضي** (يُحدَّث كل 30 ث وعند مغادرة الصفحة) + نتائج الكويز |
| 🟢 المتصلون الآن | Heartbeat كل 30 ث → متصل إذا آخر ظهور خلال 90 ث. يظهر في الـ Navbar ولوحة التحكم |
| 🎬 المشغّل | نفس تصميم العروض (1280×720 يتكيّف مع الشاشة، RTL، خط Cairo) — حركات GSAP لكل عنصر، fragments، كويز تفاعلي، Auto-fit، اختصارات لوحة المفاتيح، لمس، Resume تلقائي من آخر شريحة |
| 🛠 لوحة تحكم | إحصائيات، تقدم كل جلسة، المتصلون الآن، آخر نشاط، إدارة المستخدمين (إضافة/تعطيل/تغيير دور/إعادة كلمة مرور/حذف)، صفحة تفصيلية لكل طالب |
| 📝 ملاحظات المُحاضر | زر `N` داخل المشغّل (للمدير فقط) |

## هيكل المشروع
```
lms/
├─ prisma/
│  ├─ schema.prisma            # SQLite (تطوير)
│  ├─ schema.postgres.prisma   # نسخة PostgreSQL (إنتاج)
│  └─ seed.ts                  # إنشاء حساب المدير من .env
├─ src/
│  ├─ app/
│  │  ├─ login/                # صفحة الدخول
│  │  ├─ dashboard/            # لوحة الطالب (الجلسات + التقدم)
│  │  ├─ session/[num]/        # مشغّل الجلسة
│  │  ├─ admin/                # لوحة التحكم /users /students/[id]
│  │  ├─ api/                  # auth, progress, quiz, presence, admin
│  │  ├─ deck.css              # ستايل الشرائح (منقول من العروض الأصلية)
│  │  └─ globals.css           # Tailwind
│  ├─ components/
│  │  ├─ deck/  Player.tsx (GSAP runtime)  Slides.tsx (25 نوع شريحة)  Circuit.tsx
│  │  └─ ui/    Nav, Presence, Reveal (GSAP), Logo
│  ├─ data/content.json        # كل محتوى الـ 14 جلسة (المصدر الوحيد للمحتوى)
│  ├─ lib/  auth.ts  prisma.ts  content.ts  api.ts
│  └─ middleware.ts            # حماية المسارات + الأدوار
├─ Dockerfile · docker-compose.yml · .env.example
```

---

## 1) التشغيل محليًا (Development)
المتطلبات: **Node.js 20+** و npm.

```bash
cd lms
cp .env.example .env          # عدّل AUTH_SECRET و ADMIN_PASSWORD
npm install                   # يشغّل prisma generate تلقائيًا
npx prisma db push            # ينشئ قاعدة SQLite: prisma/dev.db
npm run db:seed               # ينشئ حساب المدير
npm run dev                   # http://localhost:3000
```
بيانات الدخول الافتراضية: `admin` / `Admin@12345` (غيّرها من `.env` قبل الـ seed، أو من لوحة المستخدمين → 🔑 كلمة مرور).

### متغيرات البيئة
| المتغير | الوصف |
|---|---|
| `DATABASE_URL` | `file:./dev.db` للتطوير — أو رابط PostgreSQL للإنتاج |
| `AUTH_SECRET` | سلسلة عشوائية ≥ 32 حرف لتوقيع الـ JWT (`openssl rand -base64 48`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_NAME` | حساب المدير الأول (يُستخدم في seed فقط) |

---

## 2) النشر على الإنتاج

### الخيار A — VPS (Ubuntu) + PostgreSQL + PM2 + Nginx  ← الأنسب لمدرسة
```bash
# على السيرفر
sudo apt update && sudo apt install -y nginx postgresql
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2

# قاعدة البيانات
sudo -u postgres psql -c "CREATE USER lms WITH PASSWORD 'STRONG_PASS';"
sudo -u postgres psql -c "CREATE DATABASE lms OWNER lms;"

# المشروع
git clone <repo> /var/www/lms && cd /var/www/lms
cp prisma/schema.postgres.prisma prisma/schema.prisma      # التحويل إلى PostgreSQL
cat > .env <<EOT
DATABASE_URL="postgresql://lms:STRONG_PASS@localhost:5432/lms"
AUTH_SECRET="$(openssl rand -base64 48)"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ChangeMe!2026"
ADMIN_NAME="Eng. Zyad Elbehiry"
EOT
npm ci
npx prisma db push          # أو: npx prisma migrate dev --name init  ثم  migrate deploy
npm run db:seed
npm run build
pm2 start npm --name lms -- start
pm2 save && pm2 startup     # يشتغل تلقائيًا بعد إعادة التشغيل
```
Nginx (`/etc/nginx/sites-available/lms`):
```nginx
server {
  listen 80; server_name lms.yourschool.com;
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host; proxy_set_header X-Forwarded-Proto $scheme; }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d lms.yourschool.com   # HTTPS مجاني
```
تحديث لاحقًا: `git pull && npm ci && npx prisma db push && npm run build && pm2 restart lms`

### الخيار B — Docker (أسرع طريقة)
```bash
cp prisma/schema.postgres.prisma prisma/schema.prisma
AUTH_SECRET=$(openssl rand -base64 48) ADMIN_PASSWORD='ChangeMe!2026' docker compose up -d --build
docker compose exec web npx prisma db push
docker compose exec web npx tsx prisma/seed.ts      # أو npm run db:seed
```
المنصة على `http://SERVER_IP:3000` (ضع Nginx/Caddy أمامها للـ HTTPS).

### الخيار C — Vercel + قاعدة بيانات مُدارة (Neon / Supabase)
1. أنشئ قاعدة PostgreSQL مجانية على [neon.tech](https://neon.tech) وانسخ `DATABASE_URL`.
2. `cp prisma/schema.postgres.prisma prisma/schema.prisma` ثم ارفع المشروع إلى GitHub.
3. في Vercel → Import → أضف Environment Variables: `DATABASE_URL`, `AUTH_SECRET`.
4. Build Command: `prisma generate && prisma db push && next build`.
5. بعد أول نشر، شغّل الـ seed محليًا بنفس `DATABASE_URL`: `DATABASE_URL="postgres://..." npm run db:seed`.

> ⚠️ SQLite لا يصلح على Vercel (نظام ملفات مؤقت) — استخدم PostgreSQL هناك.

---

## 3) الاستخدام اليومي
1. ادخل كمدير → **المستخدمون** → أضف الطلاب (الاسم، اسم مستخدم إنجليزي، كلمة مرور تُولَّد تلقائيًا — انسخها وأعطها للطالب).
2. الطالب يدخل → **الجلسات** → يبدأ الجلسة؛ تقدمه ووقته يُسجَّلان تلقائيًا ويكمل من حيث توقف.
3. **لوحة التحكم**: من متصل الآن وفي أي شريحة، نسبة الإنجاز لكل جلسة، دقة الكويز، وصفحة تفصيلية لكل طالب.
4. اختصارات المشغّل: `Space/←` التالي · `→` السابق · `N` ملاحظات المدرس · `F` ملء الشاشة · `Esc` خروج · لمس بالسحب.

## 4) تعديل المحتوى
كل المحتوى في `src/data/content.json` (نفس هيكل مولّد العروض الأصلي). عدّل النص وأعد `npm run build`. لإضافة نوع شريحة جديد أضِف مكوّنًا في `src/components/deck/Slides.tsx` وسجّله في `RENDER`.

## API (مختصر)
| Method | Path | من |
|---|---|---|
| POST | `/api/auth/login` `/logout` · GET `/me` | الجميع |
| GET/POST | `/api/progress` | طالب (POST: `{sessionNum, slide, deltaSec}`) |
| POST | `/api/quiz` | طالب |
| POST | `/api/presence/heartbeat` · GET `/api/presence/online` | مسجّل الدخول |
| GET/POST | `/api/admin/users` · PATCH/DELETE `/api/admin/users/:id` · GET `/api/admin/overview` | مدير فقط |

## الأمان
كلمات المرور مُشفّرة bcrypt · JWT httpOnly/SameSite=Lax/Secure · تحقق من الأدوار في الـ middleware **و** داخل كل route · zod للتحقق من المدخلات · الحسابات المعطّلة تُرفض فورًا حتى لو معها كوكي صالح.
