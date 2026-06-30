import {
  hashToken,
  compareToken,
} from "../../utils/hashToken";

describe("Hash Token Utils", () => {

  it("should hash a token", async () => {

    const token = "my-secret-token";

    const hash = await hashToken(token);

    expect(hash).not.toBe(token);

    expect(hash.startsWith("$2")).toBe(true);

  });

  it("should compare matching token", async () => {

    const token = "my-secret-token";

    const hash = await hashToken(token);

    const result = await compareToken(
      token,
      hash
    );

    expect(result).toBe(true);

  });

  it("should reject wrong token", async () => {

    const token = "my-secret-token";

    const hash = await hashToken(token);

    const result = await compareToken(
      "wrong-token",
      hash
    );

    expect(result).toBe(false);

  });

});