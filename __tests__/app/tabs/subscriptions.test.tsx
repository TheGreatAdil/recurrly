import { render, screen } from "@testing-library/react-native";
import React from "react";

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

import Subscriptions from "@/app/(tabs)/subscriptions";

describe("Subscriptions screen", () => {
  it("renders without crashing", () => {
    expect(() => render(<Subscriptions />)).not.toThrow();
  });

  it("displays the Subscriptions text", () => {
    render(<Subscriptions />);
    expect(screen.getByText("Subscriptions")).toBeTruthy();
  });

  it("renders within a SafeAreaView container", () => {
    render(<Subscriptions />);
    expect(screen.getByTestId("safe-area-view")).toBeTruthy();
  });
});