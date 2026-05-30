# Auth API Plan

Base route: `/api/auth`

## Task Handoff

| Owner | Task | Start point | Status |
| --- | --- | --- | --- |
| Bhavishya | Mention all planned endpoints with their schemas | Keep this document updated | Pending |
| Rahul | Create registration API | Add `POST /register` in `src/routes/auth.routes.js` before `/refresh-token` | Pending |
| Dinesh | Create login API | Add `POST /login` in `src/routes/auth.routes.js` before `/refresh-token` | Pending |
| Kaif | Create refreshToken API | `POST /refresh-token` is already added | Done |
| Bhavishya | Create logout user API | Add `POST /logout` in `src/routes/auth.routes.js` after `/refresh-token` | Pending |

## Endpoints And Schemas

### POST `/register`

Request body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

### POST `/login`

Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

Success response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
}
```

Cookie:

```txt
refreshToken=<jwt>; HttpOnly; SameSite=Strict
```

### POST `/refresh-token`

Request cookie:

```txt
refreshToken=<jwt>
```

Success response:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "string"
  }
}
```

Cookie:

```txt
refreshToken=<new-jwt>; HttpOnly; SameSite=Strict
```

### POST `/logout`

Request cookie:

```txt
refreshToken=<jwt>
```

Success response:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

Logout should clear `user.refreshToken` in MongoDB and clear the `refreshToken` cookie.
