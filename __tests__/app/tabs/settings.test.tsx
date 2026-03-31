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

import Settings from "@/app/(tabs)/settings";

describe("Settings screen", () => {
  it("renders without crashing", () => {
    expect(() => render(<Settings />)).not.toThrow();
  });

  it("displays the Settings text", () => {
    render(<Settings />);
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("renders within a SafeAreaView container", () => {
    render(<Settings />);
    expect(screen.getByTestId("safe-area-view")).toBeTruthy();
  });
});