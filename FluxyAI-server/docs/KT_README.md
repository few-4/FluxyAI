# KT README: Refresh Token API

## Important Dependency

Refresh-token API ka complete live test login API ke baad hoga, kyunki login API hi first refresh token generate karegi, `user.refreshToken` me save karegi, aur browser/client ko cookie set karegi.

Route check without cookie:

```txt
POST /api/auth/refresh-token
401 {"success":false,"message":"Refresh token is required"}
```

## Overview

Refresh token API ka kaam user ke existing valid refresh token se naya access token generate karna hai. Saath hi API refresh token ko rotate karti hai, yani old refresh token ko replace karke DB aur cookie me new refresh token save karti hai.

Base route:

```txt
/api/auth
```

Endpoint:

```txt
POST /api/auth/refresh-token
```

## Files Added Or Updated

| File | Purpose |
| --- | --- |
| `src/routes/auth.routes.js` | Auth route registration. Refresh token route yahin define hai. |
| `src/controllers/auth.controller.js` | Cookie se old refresh token leta hai, service call karta hai, new cookie set karta hai. |
| `src/services/auth.service.js` | Token verify, user lookup, DB token match, token rotation logic. |
| `src/utils/tokenManager.js` | JWT access token, refresh token generate aur refresh token verify helper. |
| `src/models/user.model.js` | User schema me `refreshToken` field add ki gayi hai. |
| `src/app.js` | JSON parser, cookie parser, auth routes, aur error handler added. |
| `src/config/environment.js` | JWT aur refresh token env variables required list me added. |
| `.env.example` | Required token env examples added. |
| `docs/auth-api-plan.md` | Auth endpoint schemas aur team handoff plan. |

## Request Schema

Refresh token request body nahi leta. Token cookie se aata hai.

```txt
Cookie: refreshToken=<jwt>
```

## Success Response

Status code:

```txt
200 OK
```

Response body:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "string"
  }
}
```

Response cookie:

```txt
refreshToken=<new-jwt>; HttpOnly; SameSite=Strict
```

## Error Cases

Status code:

```txt
401 Unauthorized
```

Possible messages:

```txt
Refresh token is required
Invalid or expired refresh token
Invalid refresh token
User not found
Refresh token does not match
```

## Flow

1. Client `POST /api/auth/refresh-token` call karta hai.
2. `cookie-parser` cookie ko `req.cookies.refreshToken` me parse karta hai.
3. Controller old refresh token ko service me pass karta hai.
4. Service refresh token ko `REFRESH_TOKEN_SECRET` se verify karti hai.
5. Service decoded user id se user ko MongoDB me find karti hai.
6. Service DB me saved `user.refreshToken` ko request cookie token se match karti hai.
7. Match hone par new access token aur new refresh token generate hote hain.
8. New refresh token `user.refreshToken` me save hota hai.
9. Controller new refresh token ko httpOnly cookie me set karta hai.
10. API response me new access token return hota hai.

## Required Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/fluxyai
JWT_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
```

## Team Handoff

| Owner | Task | Start Point |
| --- | --- | --- |
| Bhavishya | Mention all planned endpoints with schemas | `docs/auth-api-plan.md` |
| Rahul | Registration API | Add `POST /register` in `src/routes/auth.routes.js` before `/refresh-token` |
| Dinesh | Login API | Add `POST /login` before `/refresh-token`; login must save `user.refreshToken` and set cookie |
| Kaif | Refresh token API | `POST /refresh-token` implemented |
| Bhavishya | Logout API | Add `POST /logout` after `/refresh-token`; logout must clear DB token and cookie |

## Important Dependency

Refresh-token API ka complete live test login API ke baad hoga, kyunki login API hi first refresh token generate karegi, `user.refreshToken` me save karegi, aur browser/client ko cookie set karegi.

## Verification Done

Syntax checks:

```txt
node --check src/app.js
node --check src/routes/auth.routes.js
node --check src/controllers/auth.controller.js
node --check src/services/auth.service.js
node --check src/utils/tokenManager.js
node --check src/models/user.model.js
```

Route check without cookie:

```txt
POST /api/auth/refresh-token
401 {"success":false,"message":"Refresh token is required"}
```
