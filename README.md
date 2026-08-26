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

Единственный аккаунт, под которым можно залогиниться, задаётся переменными `AUTH_EMAIL` / `AUTH_PASSWORD` в `.env`.

---

## Как это работает

1. **Логин** (`POST /api/auth/login`) — сервер проверяет email/пароль, выдаёт `accessToken` в теле ответа и кладёт `refreshToken` в httpOnly-cookie (`refresh_token`, путь `/api/auth`).
2. **Access-токен** живёт только в памяти клиента (в сторе `sessionModel`) — при обновлении страницы он теряется.
3. **Инициализация сессии** (`sessionModel.init`, вызывается один раз в `App.tsx`) — при старте приложения клиент дергает `POST /api/auth/refresh`: если refresh-cookie валидна, сессия восстанавливается без повторного ввода пароля.
4. **Автоматический рефреш** — axios response-интерцептор (`shared/api/index.ts`) ловит `401`, один раз рефрешит токен через `/api/auth/refresh` (параллельные 401 переиспользуют один и тот же промис рефреша) и повторяет исходный запрос. Если рефреш не помог — сессия сбрасывается.
5. **Логаут** (`POST /api/auth/logout`) — сервер чистит refresh-cookie, клиент чистит стор сессии.

---

## API Reference

### POST /api/auth/login

```json
// Тело запроса
{ "email": "you@example.com", "password": "change-me" }

// Успех — 200
{ "accessToken": "<jwt>", "email": "you@example.com" }

// Неверные данные — 401
{ "error": "Invalid email or password" }
```

### POST /api/auth/refresh

Читает `refresh_token` из cookie, ничего не принимает в теле.

```json
// Успех — 200
{ "accessToken": "<jwt>", "email": "you@example.com" }

// Cookie нет / просрочена — 401
{ "error": "Not authenticated" }
// или
{ "error": "Session expired" }
```

### POST /api/auth/logout

```json
// 200, всегда
{ "ok": true }
```

### GET /api/me

```
Authorization: Bearer <accessToken>
```

```json
// Успех — 200
{ "email": "you@example.com" }

// Токена нет / невалиден — 401
{ "error": "Invalid token" }
```

---

## Токены

| Токен   | TTL | Где хранится                          |
|---------|-----|----------------------------------------|
| Access  | 15 минут | в памяти клиента (стор `sessionModel`) |
| Refresh | 30 дней  | httpOnly-cookie `refresh_token`, путь `/api/auth` |

Секреты (`ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`) генерируются командой `openssl rand -base64 32` и задаются в `.env` (см. `.env.example`).

---

## Проверка API прямо из консоли браузера

```ts
// Логин
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'you@example.com', password: 'change-me' }),
}).then(r => r.json()).then(console.log)

// Рефреш (использует refresh-cookie)
fetch('http://localhost:3000/api/auth/refresh', {
  method: 'POST',
  credentials: 'include',
}).then(r => r.json()).then(console.log)

// Проверка access-токена
fetch('http://localhost:3000/api/me', {
  headers: { Authorization: `Bearer ${accessToken}` },
}).then(r => r.json()).then(console.log)
```
