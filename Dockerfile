# الواجهة (Next.js) — بناء متعدد المراحل بإخراج standalone (صورة خفيفة)

# 1) الاعتماديات
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm install (وليس ci) لأن بعض الاعتماديات الاختيارية خاصة بالمنصة
# (@emnapi/‏* لبديل wasm على musl) وقد لا تكون في lock المُولَّد على منصة أخرى.
RUN npm install --no-audit --no-fund

# 2) البناء
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* تُدمج داخل كود المتصفح وقت البناء — لازم رابط الباك إند العام هنا.
# محلياً القيمة الافتراضية تكفي؛ في الإنتاج مرّر الرابط العام عبر --build-arg أو compose.
ARG NEXT_PUBLIC_DJANGO_API_URL=http://127.0.0.1:8000
ENV NEXT_PUBLIC_DJANGO_API_URL=$NEXT_PUBLIC_DJANGO_API_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) التشغيل (server.js الناتج من standalone)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# مستخدم غير-root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
# انسخ ملفات التشغيل فقط
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
