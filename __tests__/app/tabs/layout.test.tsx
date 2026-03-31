import { render, screen } from "@testing-library/react-native";
import React from "react";

// Mock constants/data to control tab data
jest.mock("@/constants/data", () => ({
  tabs: [
    { name: "index", title: "Home", icon: "home-icon" },
    { name: "subscriptions", title: "Subscriptions", icon: "wallet-icon" },
    { name: "insights", title: "Insights", icon: "activity-icon" },
    { name: "settings", title: "Settings", icon: "setting-icon" },
  ],
}));

// Mock constants/theme
jest.mock("@/constants/theme", () => ({
  colors: { primary: "#081126" },
  components: {
    tabBar: {
      height: 72,
      horizontalInset: 20,
      radius: 32,
      iconFrame: 48,
      itemPaddingVertical: 8,
    },
  },
}));

// Mock clsx
jest.mock("clsx", () => ({
  default: (...args: (string | boolean | undefined)[]) =>
    args.filter(Boolean).join(" "),
  __esModule: true,
}));

// Mock expo-router Tabs
const mockScreens: { name: string; title?: string }[] = [];
jest.mock("expo-router", () => {
  const { View, Text } = require("react-native");

  const Screen = ({
    name,
    options,
  }: {
    name: string;
    options?: { title?: string; tabBarIcon?: (props: { focused: boolean }) => React.ReactNode };
  }) => {
    mockScreens.push({ name, title: options?.title });
    // Render the tab icon in both focused and unfocused states for testing
    const focusedIcon = options?.tabBarIcon?.({ focused: true });
    const unfocusedIcon = options?.tabBarIcon?.({ focused: false });
    return (
      <View testID={`tab-screen-${name}`}>
        <Text>{options?.title}</Text>
        <View testID={`tab-icon-focused-${name}`}>{focusedIcon}</View>
        <View testID={`tab-icon-unfocused-${name}`}>{unfocusedIcon}</View>
      </View>
    );
  };

  const Tabs = ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View testID="tabs-navigator">{children}</View>;
  };
  Tabs.Screen = Screen;

  return { Tabs };
});

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

import TabLayout from "@/app/(tabs)/_layout";

beforeEach(() => {
  mockScreens.length = 0;
});

describe("TabLayout", () => {
  it("renders without crashing", () => {
    expect(() => render(<TabLayout />)).not.toThrow();
  });

  it("renders a Tabs navigator", () => {
    render(<TabLayout />);
    expect(screen.getByTestId("tabs-navigator")).toBeTruthy();
  });

  it("renders a screen for each tab in the data", () => {
    render(<TabLayout />);
    expect(screen.getByTestId("tab-screen-index")).toBeTruthy();
    expect(screen.getByTestId("tab-screen-subscriptions")).toBeTruthy();
    expect(screen.getByTestId("tab-screen-insights")).toBeTruthy();
    expect(screen.getByTestId("tab-screen-settings")).toBeTruthy();
  });

  it("registers four tab screens", () => {
    render(<TabLayout />);
    expect(mockScreens).toHaveLength(4);
  });

  it("assigns correct titles to tab screens", () => {
    render(<TabLayout />);
    const titles = mockScreens.map((s) => s.title);
    expect(titles).toContain("Home");
    expect(titles).toContain("Subscriptions");
    expect(titles).toContain("Insights");
    expect(titles).toContain("Settings");
  });
});

describe("TabIcon component", () => {
  it("renders focused icon for each tab", () => {
    render(<TabLayout />);
    expect(screen.getByTestId("tab-icon-focused-index")).toBeTruthy();
    expect(screen.getByTestId("tab-icon-focused-subscriptions")).toBeTruthy();
    expect(screen.getByTestId("tab-icon-focused-insights")).toBeTruthy();
    expect(screen.getByTestId("tab-icon-focused-settings")).toBeTruthy();
  });

  it("renders unfocused icon for each tab", () => {
    render(<TabLayout />);
    expect(screen.getByTestId("tab-icon-unfocused-index")).toBeTruthy();
    expect(screen.getByTestId("tab-icon-unfocused-subscriptions")).toBeTruthy();
    expect(screen.getByTestId("tab-icon-unfocused-insights")).toBeTruthy();
    expect(screen.getByTestId("tab-icon-unfocused-settings")).toBeTruthy();
  });
});