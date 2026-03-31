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

import SignIn from "@/app/(auth)/sign-in";

describe("SignIn screen", () => {
  it("renders without crashing", () => {
    expect(() => render(<SignIn />)).not.toThrow();
  });

  it("displays the Sign In text", () => {
    render(<SignIn />);
    expect(screen.getByText("Sign In")).toBeTruthy();
  });

  it("displays a Create Account link", () => {
    render(<SignIn />);
    expect(screen.getByText("Create Account")).toBeTruthy();
  });

  it("Create Account link points to sign-up route", () => {
    render(<SignIn />);
    const link = screen.getByTestId("link-/(auth)/sign-up");
    expect(link).toBeTruthy();
  });

  it("renders within a SafeAreaView container", () => {
    render(<SignIn />);
    expect(screen.getByTestId("safe-area-view")).toBeTruthy();
  });
});