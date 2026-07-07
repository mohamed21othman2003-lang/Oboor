# باك إند Django (مركز عبور)
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# 1) الاعتماديات أولاً (طبقة كاش تُعاد فقط عند تغيّر requirements)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2) كود التطبيق
COPY . .

EXPOSE 8000

# 3) عند التشغيل: هجرة قاعدة البيانات + تجميع الملفات الثابتة + تشغيل gunicorn
#    (تُقرأ متغيّرات البيئة من .env عبر docker-compose أو --env-file)
CMD python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    gunicorn config.wsgi:application --bind 0.0.0.0:${PORT} --workers 3
