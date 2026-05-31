# PR README: Create Refresh Token API

## Important Dependency

Refresh-token API ka complete live test login API ke baad hoga, kyunki login API hi first refresh token generate karegi, `user.refreshToken` me save karegi, aur browser/client ko cookie set karegi.

Route check without cookie:

```txt
POST /api/auth/refresh-token
401 {"success":false,"message":"Refresh token is required"}
```

## Summary

This PR adds the refresh token API for auth session renewal. The endpoint validates the refresh token from an httpOnly cookie, checks it against the token stored on the user document, rotates the refresh token, and returns a fresh access token.

## Endpoint

```txt
POST /api/auth/refresh-token
```

Request:

```txt
Cookie: refreshToken=<jwt>
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

The API also sets a new `refreshToken` httpOnly cookie.

## Changes

- Added auth route mounting at `/api/auth`.
- Added `POST /refresh-token` route.
- Added refresh token controller method.
- Added auth service logic for refresh token verification and rotation.
- Added JWT token manager utility for access token generation, refresh token generation, and refresh token verification.
- Added `refreshToken` field to the `User` schema.
- Added cookie parser middleware.
- Added centralized error response support for auth failures.
- Added required JWT environment variables in environment config and `.env.example`.
- Added auth API plan and team handoff documentation.

## Error Handling

Invalid auth cases return `401 Unauthorized`, including:

- Missing refresh token cookie.
- Invalid or expired refresh token.
- Missing user id in decoded token.
- User not found.
- Refresh token mismatch with DB.

## Testing

Passed:

```txt
node --check src/app.js
node --check src/routes/auth.routes.js
node --check src/controllers/auth.controller.js
node --check src/services/auth.service.js
node --check src/utils/tokenManager.js
node --check src/models/user.model.js
```

Manual route check:

```txt
POST /api/auth/refresh-token
401 {"success":false,"message":"Refresh token is required"}
```

Not covered yet:

```txt
Full successful refresh-token flow
```

Reason: login API is not implemented yet. Login must create the initial refresh token, save it in `user.refreshToken`, and set the `refreshToken` cookie.

## Notes For Reviewers

- `POST /refresh-token` does not accept request body data.
- The refresh token is intentionally stored in an httpOnly cookie.
- Refresh token rotation is implemented: every successful refresh replaces the old DB token with a new one.
- `secure` cookie flag is enabled only when `NODE_ENV === "production"`.
- Next auth tasks are registration, login, and logout APIs.
