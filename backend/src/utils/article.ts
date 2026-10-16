const TYPE_CODES: Record<string, string> = {
  necklace: "NK",
  bracelet: "BR",
  earrings: "ER",
  ring: "RG",
};

export function buildArticle(jewelryType: string, componentIds: number[]): string {
  const code = TYPE_CODES[jewelryType] ?? "XX";
  const sorted = [...componentIds].sort((a, b) => a - b);
  return ["NB", code, ...sorted].join("-");
}
