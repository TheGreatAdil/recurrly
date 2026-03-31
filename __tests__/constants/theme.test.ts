import { colors, components, spacing, theme } from "@/constants/theme";

describe("colors", () => {
  it("exports all required color tokens", () => {
    expect(colors).toHaveProperty("background");
    expect(colors).toHaveProperty("foreground");
    expect(colors).toHaveProperty("card");
    expect(colors).toHaveProperty("muted");
    expect(colors).toHaveProperty("mutedForeground");
    expect(colors).toHaveProperty("primary");
    expect(colors).toHaveProperty("accent");
    expect(colors).toHaveProperty("border");
    expect(colors).toHaveProperty("success");
    expect(colors).toHaveProperty("destructive");
    expect(colors).toHaveProperty("subscription");
  });

  it("has correct color values", () => {
    expect(colors.background).toBe("#fff9e3");
    expect(colors.foreground).toBe("#081126");
    expect(colors.card).toBe("#fff8e7");
    expect(colors.muted).toBe("#f6eecf");
    expect(colors.mutedForeground).toBe("rgba(0, 0, 0, 0.6)");
    expect(colors.primary).toBe("#081126");
    expect(colors.accent).toBe("#ea7a53");
    expect(colors.border).toBe("rgba(0, 0, 0, 0.1)");
    expect(colors.success).toBe("#16a34a");
    expect(colors.destructive).toBe("#dc2626");
    expect(colors.subscription).toBe("#8fd1bd");
  });

  it("is a readonly const (all values are strings)", () => {
    for (const value of Object.values(colors)) {
      expect(typeof value).toBe("string");
    }
  });
});

describe("spacing", () => {
  it("exports spacing values as numbers", () => {
    for (const value of Object.values(spacing)) {
      expect(typeof value).toBe("number");
    }
  });

  it("has correct spacing values", () => {
    expect(spacing[0]).toBe(0);
    expect(spacing[1]).toBe(4);
    expect(spacing[2]).toBe(8);
    expect(spacing[4]).toBe(16);
    expect(spacing[5]).toBe(20);
    expect(spacing[8]).toBe(32);
    expect(spacing[12]).toBe(48);
    expect(spacing[18]).toBe(72);
  });

  it("has spacing values in ascending order for defined keys", () => {
    const keys = Object.keys(spacing).map(Number).sort((a, b) => a - b);
    let prevValue = -1;
    for (const key of keys) {
      expect(spacing[key as keyof typeof spacing]).toBeGreaterThan(prevValue);
      prevValue = spacing[key as keyof typeof spacing];
    }
  });

  it("includes all expected spacing keys", () => {
    const expectedKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30];
    for (const key of expectedKeys) {
      expect(spacing).toHaveProperty(String(key));
    }
  });
});

describe("components", () => {
  it("exports tabBar configuration", () => {
    expect(components).toHaveProperty("tabBar");
  });

  it("tabBar has all required properties", () => {
    const { tabBar } = components;
    expect(tabBar).toHaveProperty("height");
    expect(tabBar).toHaveProperty("horizontalInset");
    expect(tabBar).toHaveProperty("radius");
    expect(tabBar).toHaveProperty("iconFrame");
    expect(tabBar).toHaveProperty("itemPaddingVertical");
  });

  it("tabBar uses spacing values", () => {
    const { tabBar } = components;
    expect(tabBar.height).toBe(spacing[18]);
    expect(tabBar.horizontalInset).toBe(spacing[5]);
    expect(tabBar.radius).toBe(spacing[8]);
    expect(tabBar.iconFrame).toBe(spacing[12]);
    expect(tabBar.itemPaddingVertical).toBe(spacing[2]);
  });

  it("tabBar values are positive numbers", () => {
    for (const value of Object.values(components.tabBar)) {
      expect(typeof value).toBe("number");
      expect(value).toBeGreaterThan(0);
    }
  });
});

describe("theme", () => {
  it("re-exports colors, spacing, and components", () => {
    expect(theme.colors).toBe(colors);
    expect(theme.spacing).toBe(spacing);
    expect(theme.components).toBe(components);
  });

  it("is a flat object with three keys", () => {
    const keys = Object.keys(theme);
    expect(keys).toContain("colors");
    expect(keys).toContain("spacing");
    expect(keys).toContain("components");
  });
});