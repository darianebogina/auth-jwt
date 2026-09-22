# Auth JWT — Access/Refresh Token Demo

Учебный проект: аутентификация на паре access/refresh JWT-токенов. Access-токен живёт в памяти клиента, refresh — в httpOnly-cookie, при истечении access-токена клиент прозрачно рефрешится через axios-интерцептор.

## Структура проекта

```
auth-jwt/
├── src/                        # Next.js API-сервер
│   ├── app/api/
│   │   ├── auth/login/         # POST — логин по email/паролю
│   │   ├── auth/logout/        # POST — разлогин
│   │   ├── auth/refresh/       # POST — выпуск нового access-токена
│   │   └── me/                 # GET  — проверка access-токена
│   ├── lib/auth/
│   │   ├── tokens.ts           # sign/verify access и refresh JWT (jose)
│   │   ├── cookies.ts          # httpOnly refresh-cookie
│   │   └── credentials.ts      # проверка логина/пароля из env
│   └── proxy.ts                # CORS для запросов с клиента (CLIENT_ORIGIN)
└── client/                     # React-приложение (Vite + TypeScript, FSD)
    └── src/
        ├── app/                # точка входа, инициализация сессии
        ├── pages/home/         # экран логина / личного кабинета
        ├── features/auth/      # login, logout
        ├── entities/session/   # sessionModel: стор сессии, login/logout/init
        └── shared/
            ├── api/            # axios-инстанс + интерцептор рефреша
            └── ui/              # Button, TextField, Card
```

## Запуск

Нужно запустить два процесса в разных терминалах:

```bash
# Терминал 1 — Next.js API-сервер (порт 3000)
cp .env.example .env   # заполнить AUTH_EMAIL / AUTH_PASSWORD / *_SECRET
npm run dev

# Терминал 2 — React-приложение (порт 5173)
cd client
npm run dev
```

Открой в браузере: **http://localhost:5173**

## Аккаунт, под которым можно залогиниться, задаётся переменными в `.env`.
---

## Токены

| Токен   | TTL | Где хранится                          |
|---------|-----|----------------------------------------|
| Access  | 15 минут | в памяти клиента (стор `sessionModel`) |
| Refresh | 30 дней  | httpOnly-cookie `refresh_token`, путь `/api/auth` |

Секреты (`ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`) генерируются командой `openssl rand -base64 32` и задаются в `.env` (см. `.env.example`).
