import { MockedProvider } from "@apollo/client/testing";
import { screen } from "@testing-library/react";
import React from "react";
import { setup } from "testUtils";

import { presentationalPropsMock } from "./mocks/propsMock";
import PropertyInformation, {
  Presentational,
  PresentationalProps,
} from "./Public";

const defaultPresentationalProps: PresentationalProps = {
  ...presentationalPropsMock,
  overrideAnswer: jest.fn(),
};

test("renders a warning for editors if address data is not in state", async () => {
  setup(
    <MockedProvider>
      <PropertyInformation
        title="About the property"
        description="This is the information we currently have about the property"
      />
    </MockedProvider>,
  );

  expect(screen.getByTestId("error-summary-invalid-graph")).toBeInTheDocument();
});

test("renders correctly when property override is enabled", async () => {
  const handleSubmit = jest.fn();

  const { user } = setup(
    <MockedProvider>
      <Presentational
        {...defaultPresentationalProps}
        showPropertyTypeOverride={true}
        handleSubmit={handleSubmit}
      />
    </MockedProvider>,
  );

  expect(screen.getByText("About the property")).toBeInTheDocument();
  expect(screen.getByText("Property type")).toBeInTheDocument();

  expect(screen.getByText("Change")).toBeInTheDocument();
  expect(screen.queryByText("Report an inaccuracy")).not.toBeInTheDocument();

  await user.click(screen.getByTestId("continue-button"));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

test("renders correctly when property override is toggled off", async () => {
  const handleSubmit = jest.fn();

  const { user } = setup(
    <MockedProvider>
      <Presentational
        {...defaultPresentationalProps}
        showPropertyTypeOverride={false}
        handleSubmit={handleSubmit}
      />
    </MockedProvider>,
  );

  expect(screen.getByText("About the property")).toBeInTheDocument();
  expect(screen.getByText("Property type")).toBeInTheDocument();

  expect(screen.queryByText("Change")).not.toBeInTheDocument();
  expect(screen.getByText("Report an inaccuracy")).toBeInTheDocument();

  await user.click(screen.getByTestId("continue-button"));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

test("retains previously submitted feedback when going back", async () => {
  const { user } = setup(
    <MockedProvider>
      <Presentational
        {...defaultPresentationalProps}
        showPropertyTypeOverride={false}
        previousFeedback="My property type is wrong"
      />
    </MockedProvider>,
  );

  expect(screen.getByText("Report an inaccuracy")).toBeInTheDocument();

  // expand the feedback input
  await user.click(screen.getByText("Report an inaccuracy"));
  expect(screen.getByText("My property type is wrong")).toBeInTheDocument();
});
