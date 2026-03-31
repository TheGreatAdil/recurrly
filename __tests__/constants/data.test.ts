import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  tabs,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";

describe("tabs", () => {
  it("exports four tabs", () => {
    expect(tabs).toHaveLength(4);
  });

  it("includes Home, Subscriptions, Insights and Settings tabs", () => {
    const names = tabs.map((t) => t.name);
    expect(names).toContain("index");
    expect(names).toContain("subscriptions");
    expect(names).toContain("insights");
    expect(names).toContain("settings");
  });

  it("each tab has name, title and icon", () => {
    for (const tab of tabs) {
      expect(tab).toHaveProperty("name");
      expect(tab).toHaveProperty("title");
      expect(tab).toHaveProperty("icon");
      expect(typeof tab.name).toBe("string");
      expect(typeof tab.title).toBe("string");
      expect(tab.icon).toBeDefined();
    }
  });

  it("has tabs in navigation order: index, subscriptions, insights, settings", () => {
    expect(tabs[0].name).toBe("index");
    expect(tabs[1].name).toBe("subscriptions");
    expect(tabs[2].name).toBe("insights");
    expect(tabs[3].name).toBe("settings");
  });

  it("has correct titles for each tab", () => {
    expect(tabs.find((t) => t.name === "index")?.title).toBe("Home");
    expect(tabs.find((t) => t.name === "subscriptions")?.title).toBe("Subscriptions");
    expect(tabs.find((t) => t.name === "insights")?.title).toBe("Insights");
    expect(tabs.find((t) => t.name === "settings")?.title).toBe("Settings");
  });
});

describe("HOME_USER", () => {
  it("has a name property", () => {
    expect(HOME_USER).toHaveProperty("name");
  });

  it("name is a non-empty string", () => {
    expect(typeof HOME_USER.name).toBe("string");
    expect(HOME_USER.name.length).toBeGreaterThan(0);
  });
});

describe("HOME_BALANCE", () => {
  it("has amount and nextRenewalDate", () => {
    expect(HOME_BALANCE).toHaveProperty("amount");
    expect(HOME_BALANCE).toHaveProperty("nextRenewalDate");
  });

  it("amount is a positive number", () => {
    expect(typeof HOME_BALANCE.amount).toBe("number");
    expect(HOME_BALANCE.amount).toBeGreaterThan(0);
  });

  it("nextRenewalDate is a valid ISO date string", () => {
    expect(typeof HOME_BALANCE.nextRenewalDate).toBe("string");
    const date = new Date(HOME_BALANCE.nextRenewalDate);
    expect(isNaN(date.getTime())).toBe(false);
  });
});

describe("UPCOMING_SUBSCRIPTIONS", () => {
  it("is an array with at least one item", () => {
    expect(Array.isArray(UPCOMING_SUBSCRIPTIONS)).toBe(true);
    expect(UPCOMING_SUBSCRIPTIONS.length).toBeGreaterThan(0);
  });

  it("each item has id, icon, name, price, and daysLeft", () => {
    for (const sub of UPCOMING_SUBSCRIPTIONS) {
      expect(sub).toHaveProperty("id");
      expect(sub).toHaveProperty("icon");
      expect(sub).toHaveProperty("name");
      expect(sub).toHaveProperty("price");
      expect(sub).toHaveProperty("daysLeft");
    }
  });

  it("each price is a positive number", () => {
    for (const sub of UPCOMING_SUBSCRIPTIONS) {
      expect(typeof sub.price).toBe("number");
      expect(sub.price).toBeGreaterThan(0);
    }
  });

  it("each daysLeft is a positive integer", () => {
    for (const sub of UPCOMING_SUBSCRIPTIONS) {
      expect(Number.isInteger(sub.daysLeft)).toBe(true);
      expect(sub.daysLeft).toBeGreaterThan(0);
    }
  });

  it("has unique ids", () => {
    const ids = UPCOMING_SUBSCRIPTIONS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("includes Spotify, Notion and Figma", () => {
    const ids = UPCOMING_SUBSCRIPTIONS.map((s) => s.id);
    expect(ids).toContain("spotify");
    expect(ids).toContain("notion");
    expect(ids).toContain("figma");
  });
});

describe("HOME_SUBSCRIPTIONS", () => {
  it("is an array with items", () => {
    expect(Array.isArray(HOME_SUBSCRIPTIONS)).toBe(true);
    expect(HOME_SUBSCRIPTIONS.length).toBeGreaterThan(0);
  });

  it("each item has required Subscription fields", () => {
    for (const sub of HOME_SUBSCRIPTIONS) {
      expect(sub).toHaveProperty("id");
      expect(sub).toHaveProperty("icon");
      expect(sub).toHaveProperty("name");
      expect(sub).toHaveProperty("price");
      expect(sub).toHaveProperty("billing");
    }
  });

  it("each price is a positive number", () => {
    for (const sub of HOME_SUBSCRIPTIONS) {
      expect(typeof sub.price).toBe("number");
      expect(sub.price).toBeGreaterThan(0);
    }
  });

  it("has unique ids", () => {
    const ids = HOME_SUBSCRIPTIONS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("statuses are one of active, paused, or cancelled", () => {
    const validStatuses = new Set(["active", "paused", "cancelled"]);
    for (const sub of HOME_SUBSCRIPTIONS) {
      if (sub.status !== undefined) {
        expect(validStatuses.has(sub.status)).toBe(true);
      }
    }
  });

  it("includes subscriptions with each status type", () => {
    const statuses = HOME_SUBSCRIPTIONS.map((s) => s.status);
    expect(statuses).toContain("active");
    expect(statuses).toContain("paused");
    expect(statuses).toContain("cancelled");
  });

  it("renewalDate and startDate are valid ISO strings when present", () => {
    for (const sub of HOME_SUBSCRIPTIONS) {
      if (sub.renewalDate) {
        const d = new Date(sub.renewalDate);
        expect(isNaN(d.getTime())).toBe(false);
      }
      if (sub.startDate) {
        const d = new Date(sub.startDate);
        expect(isNaN(d.getTime())).toBe(false);
      }
    }
  });

  it("includes adobe-creative-cloud, github-pro, claude-pro and canva-pro", () => {
    const ids = HOME_SUBSCRIPTIONS.map((s) => s.id);
    expect(ids).toContain("adobe-creative-cloud");
    expect(ids).toContain("github-pro");
    expect(ids).toContain("claude-pro");
    expect(ids).toContain("canva-pro");
  });
});