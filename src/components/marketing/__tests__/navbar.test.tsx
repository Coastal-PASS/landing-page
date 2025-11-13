import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Navbar } from "../Navbar";

describe("Navbar", () => {
  it("renders configured top-level nav links", () => {
    render(<Navbar />);
    const primaryNav = screen.getByRole("navigation", {
      name: /primary navigation/i,
    });
    const scoped = within(primaryNav);
    expect(scoped.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(scoped.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("reveals service detail links from the dropdown", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const servicesTrigger = screen.getByRole("button", { name: /services/i });
    await user.click(servicesTrigger);

    expect(
      await screen.findByRole("link", { name: /fleet telematics/i }),
    ).toBeVisible();
  });

  it("opens the mobile sheet when the menu button is pressed", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByLabelText(/open navigation menu/i));

    expect(
      screen.getByRole("navigation", { name: /mobile navigation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /contact us/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /fleet telematics/i }),
    ).toBeInTheDocument();
  });
});
