import {cosineSimilarity}
from "../../utils/cosineSimilarity";

describe("Cosine Similarity", () => {

  it("identical vectors", () => {

    expect(

      cosineSimilarity(
        [1,2,3],
        [1,2,3]
      )

    ).toBeCloseTo(1);

  });

  it("orthogonal vectors", () => {

    expect(

      cosineSimilarity(
        [1,0],
        [0,1]
      )

    ).toBeCloseTo(0);

  });

  it("similar vectors", () => {

    expect(

      cosineSimilarity(
        [1,2],
        [2,4]
      )

    ).toBeCloseTo(1);

  });

});