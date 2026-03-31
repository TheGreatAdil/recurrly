import { render, screen } from "@testing-library/react-native";
import React from "react";

// Mock expo-router
const mockUseLocalSearchParams = jest.fn();
jest.mock("expo-router", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => {
    const { Text } = require("react-native");
    return <Text testID={`link-${href}`}>{children}</Text>;
  },
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

// Mock nativewind styled
jest.mock("nativewind", () => ({
  styled: (Component: React.ComponentType) => Component,
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => (
      <View testID="safe-area-view" {...props}>
        {children}
      </View>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

import SubscriptionDetails from "@/app/subscriptions/[id]";

describe("SubscriptionDetails screen", () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReturnValue({ id: "spotify" });
  });

  it("renders without crashing", () => {
    expect(() => render(<SubscriptionDetails />)).not.toThrow();
  });

  it("displays the subscription id from route params", () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "spotify" });
    render(<SubscriptionDetails />);
    expect(screen.getByText("SubscriptionDetail: spotify")).toBeTruthy();
  });

  it("renders the correct id for different subscription params", () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "claude" });
    render(<SubscriptionDetails />);
    expect(screen.getByText("SubscriptionDetail: claude")).toBeTruthy();
  });

  it("has a Go back link pointing to the root route", () => {
    render(<SubscriptionDetails />);
    expect(screen.getByText("Go back")).toBeTruthy();
    expect(screen.getByTestId("link-/")).toBeTruthy();
  });

  it("renders within a SafeAreaView container", () => {
    render(<SubscriptionDetails />);
    expect(screen.getByTestId("safe-area-view")).toBeTruthy();
  });

  it("shows correct id for a numeric-style string param", () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "adobe-creative-cloud" });
    render(<SubscriptionDetails />);
    expect(screen.getByText("SubscriptionDetail: adobe-creative-cloud")).toBeTruthy();
  });

  it("handles undefined id gracefully", () => {
    mockUseLocalSearchParams.mockReturnValue({ id: undefined });
    expect(() => render(<SubscriptionDetails />)).not.toThrow();
  });
});