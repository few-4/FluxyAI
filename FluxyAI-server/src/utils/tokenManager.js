import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/environment.js";

class TokenManager {
  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      },
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id,
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      },
    );
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }
}

export default new TokenManager();
