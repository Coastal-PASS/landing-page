import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProductDetailPage from "../[product]/page";

describe("ProductDetailPage", () => {
  it("shows Trimble hero copy and contact context", async () => {
    await act(async () => {
      render(
        <ProductDetailPage params={Promise.resolve({ product: "trimble" })} />,
      );
    });

    const [heroHeading] = await screen.findAllByRole("heading", {
      name: /trimble precision ag systems/i,
    });

    expect(heroHeading).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue("products-trimble"),
    ).toBeInTheDocument();
  });
});
