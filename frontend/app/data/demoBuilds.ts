import type { SavedBuild } from "~/types";

export const demoBuilds: SavedBuild[] = [
  {
    id: "build-demo-1",
    article: "NB-NK-2-5-6",
    jewelryType: "necklace",
    jewelryTitle: "Колье",
    totalPrice: 3200,
    createdAt: "2026-09-20T10:00:00.000Z",
    components: [
      { name: "Бархатный чокер", price: 900, slot: "chain", layerZ: 1 },
      { name: "Подвеска «Крест»", price: 2000, slot: "pendant", layerZ: 5 },
      { name: "Карабин", price: 300, slot: "clasp", layerZ: 8 },
    ],
  },
];
