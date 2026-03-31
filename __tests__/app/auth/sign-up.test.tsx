import { render, screen } from "@testing-library/react-native";
import React from "react";

// Mock expo-router
jest.mock("expo-router", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => {
    const { Text } = require("react-native");
    return <Text testID={`link-${href}`}>{children}</Text>;
  },
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

import SignUp from "@/app/(auth)/sign-up";

describe("SignUp screen", () => {
  it("renders without crashing", () => {
    expect(() => render(<SignUp />)).not.toThrow();
  });

  it("displays the Sign Up text", () => {
    render(<SignUp />);
    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  it("displays a Sign In link", () => {
    render(<SignUp />);
    expect(screen.getByText("Sign In")).toBeTruthy();
  });

  it("Sign In link points to sign-in route", () => {
    render(<SignUp />);
    const link = screen.getByTestId("link-/(auth)/sign-in");
    expect(link).toBeTruthy();
  });

  it("renders within a SafeAreaView container", () => {
    render(<SignUp />);
    expect(screen.getByTestId("safe-area-view")).toBeTruthy();
  });
});