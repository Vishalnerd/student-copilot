import chunkText from "../../utils/chunkText";

describe("Chunk Text", () => {

  it("should split long text", () => {

    const text =
      "Hello ".repeat(1000);

    const chunks =
      chunkText(text);

    expect(chunks.length)
      .toBeGreaterThan(1);

  });

  it("should keep short text in one chunk", () => {

    const chunks =
      chunkText("Hello World");

    expect(chunks.length)
      .toBe(1);

  });

  it("should not lose content", () => {

    const text =
      "A".repeat(2000);

    const chunks =
      chunkText(text);

    const reconstructed =
      chunks.join("");

    expect(reconstructed.length)
      .toBe(text.length);

  });

});