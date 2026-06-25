import { describe, it, expect } from "vitest";
import { lineTotal, applyCoupon } from "@/lib/pricing";

describe("lineTotal", () => {
  it("multiplies price by qty", () => {
    expect(lineTotal(149, 2)).toBe(298);
  });
});

describe("applyCoupon", () => {
  it("applies percent discount", () => {
    expect(applyCoupon(1000, { type: "PERCENT", value: 10 })).toBe(100);
  });
  it("respects minOrder", () => {
    expect(applyCoupon(100, { type: "FLAT", value: 50, minOrder: 199 })).toBe(0);
  });
  it("caps at maxDiscount", () => {
    expect(applyCoupon(1000, { type: "PERCENT", value: 50, maxDiscount: 100 })).toBe(100);
  });
});
