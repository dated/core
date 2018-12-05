import "./__support__/mocks/core-container";

import app from "@arkecosystem/core-container";
import "jest-extended";
import { formatTimestamp } from "../src/format-timestamp";

describe("Format Timestamp", () => {
  it("should be a function", () => {
    expect(formatTimestamp).toBeFunction();
  });

  it("should compute the correct epoch value", () => {
    expect(formatTimestamp(100).epoch).toBe(100);
  });

  it("should compute the correct unix value", () => {
    expect(formatTimestamp(100).unix).toBe(1490101300);
  });

  it("should compute the correct human value", () => {
    expect(formatTimestamp(100).human).toBe("2017-03-21T13:01:40.000Z");
  });
});
