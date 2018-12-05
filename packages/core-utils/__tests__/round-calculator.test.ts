import "./__support__/mocks/core-container";

import app from "@arkecosystem/core-container";
import "jest-extended";
import { calculateRound, isNewRound } from "../src/round-calculator";

describe("Round calculator", () => {
  describe("calculateRound", () => {
    it("should be a function", () => {
      expect(calculateRound).toBeFunction();
    });

    it("should calculate the round when nextRound is the same", () => {
      const { round, nextRound } = calculateRound(1);
      expect(round).toBe(1);
      expect(nextRound).toBe(1);
    });

    it("should calculate the round when nextRound is not the same", () => {
      const { round, nextRound } = calculateRound(51);
      expect(round).toBe(1);
      expect(nextRound).toBe(2);
    });
  });

  describe("isNewRound", () => {
    it("should be a function", () => {
      expect(isNewRound).toBeFunction();
    });

    it("should determine the beginning of a new round", () => {
      expect(isNewRound(1)).toBeTrue();
      expect(isNewRound(2)).toBeFalse();
      expect(isNewRound(52)).toBeTrue();
    });
  });
});
