import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ServiceDetailPage from "../[service]/page";

describe("ServiceDetailPage", () => {
  it("renders hero copy and contextual contact form for fleet telematics", async () => {
    await act(async () => {
      render(
        <ServiceDetailPage
          params={Promise.resolve({ service: "fleet-telematics" })}
        />,
      );
    });

    const [heroHeading] = await screen.findAllByRole("heading", {
      name: /fleet telematics/i,
    });

    expect(heroHeading).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue("services-fleet-telematics"),
    ).toBeInTheDocument();
  });
});
