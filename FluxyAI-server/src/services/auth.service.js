import User from "../models/user.model.js";
import tokenManager from "../utils/tokenManager.js";

const createAuthError = (message) => {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
};

class AuthService {
  // Rahul registration API start here:
  // Add register(payload), validate username/email/password, check duplicate email,
  // hash password with bcryptjs, create User, and return user data without password.

  async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw createAuthError("Refresh token is required");
    }

    let decoded;

    try {
      decoded = tokenManager.verifyRefreshToken(oldRefreshToken);
    } catch (error) {
      throw createAuthError("Invalid or expired refresh token");
    }

    if (!decoded?.id) {
      throw createAuthError("Invalid refresh token");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      throw createAuthError("User not found");
    }

    if (user.refreshToken !== oldRefreshToken) {
      throw createAuthError("Refresh token does not match");
    }

    const accessToken = tokenManager.generateAccessToken(user);
    const refreshToken = tokenManager.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
