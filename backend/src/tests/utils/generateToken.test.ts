import jwt from "jsonwebtoken";

process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";

describe("JWT Generator", () => {

  it("should generate access token", () => {

    const token = generateAccessToken("123");

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as any;

    expect(decoded.userId).toBe("123");

  });

  it("should generate refresh token", () => {

    const token = generateRefreshToken("456");

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as any;

    expect(decoded.userId).toBe("456");

  });

});