import { render, screen } from "@testing-library/react";
import React from "react";
import { FeatureFlagProvider, useFlagEnabled } from "./FeatureFlagProvider";

function Flagged() {
  const on = useFlagEnabled("modules.programBuilder");
  return <div>{on ? "ON" : "OFF"}</div>;
}

test("feature flag gating works", () => {
  render(
    <FeatureFlagProvider flags={{ "modules.programBuilder": true }}>
      <Flagged />
    </FeatureFlagProvider>
  );
  expect(screen.getByText("ON")).toBeInTheDocument();
});
