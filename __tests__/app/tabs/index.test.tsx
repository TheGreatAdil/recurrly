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

// Mock global.css
jest.mock("@/global.css", () => ({}), { virtual: true });

import App from "@/app/(tabs)/index";

describe("Home (index) screen", () => {
  it("renders without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("displays the Welcome to Nativewind text", () => {
    render(<App />);
    expect(screen.getByText("Welcome to Nativewind!")).toBeTruthy();
  });

  it("renders within a SafeAreaView container", () => {
    render(<App />);
    expect(screen.getByTestId("safe-area-view")).toBeTruthy();
  });

  it("has a link to the onboarding screen", () => {
    render(<App />);
    expect(screen.getByTestId("link-/onboarding")).toBeTruthy();
    expect(screen.getByText("Go To Onboarding")).toBeTruthy();
  });

  it("has a link to the sign-in screen", () => {
    render(<App />);
    expect(screen.getByTestId("link-/(auth)/sign-in")).toBeTruthy();
    expect(screen.getByText("Sign In")).toBeTruthy();
  });

  it("has a link to the sign-up screen", () => {
    render(<App />);
    expect(screen.getByTestId("link-/(auth)/sign-up")).toBeTruthy();
    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  it("has a link to the Spotify subscription details", () => {
    render(<App />);
    expect(screen.getByTestId("link-/subscriptions/spotify")).toBeTruthy();
    expect(screen.getByText("View Spotify Subscription")).toBeTruthy();
  });

  it("has a link to the Claude subscription details", () => {
    render(<App />);
    expect(screen.getByTestId("link-/subscriptions/claude")).toBeTruthy();
    expect(screen.getByText("Claude Subscription")).toBeTruthy();
  });
});