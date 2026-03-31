// Pre-initialize expo's lazy globals to prevent them from being loaded outside
// jest's test code scope (a jest v30 restriction that disallows module requires
// triggered by lazy property getters during module initialization).
if (typeof global.__ExpoImportMetaRegistry === "undefined") {
  global.__ExpoImportMetaRegistry = { url: null };
}
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}