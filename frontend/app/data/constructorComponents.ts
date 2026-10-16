import type { ComponentSlot, JewelryComponent, JewelrySlug, SlotConfig } from "~/types";

export const allComponents: JewelryComponent[] = [

  { id: 1, jewelryType: "necklace", slot: "chain", name: "Цепочка 1", price: 1500, image: "/assets/components/necklace/chain-1.png", layerZ: 1 },
  { id: 2, jewelryType: "necklace", slot: "chain", name: "Цепочка 2", price: 900, image: "/assets/components/necklace/chain-2.png", layerZ: 1 },
  { id: 3, jewelryType: "necklace", slot: "pendant", name: "Подвеска «Роза»", price: 1200, image: "/assets/components/necklace/pendant-rose.png", layerZ: 5 },
  { id: 4, jewelryType: "necklace", slot: "pendant", name: "Подвеска «Оникс»", price: 1500, image: "/assets/components/necklace/pendant-onyx.png", layerZ: 5 },
  { id: 5, jewelryType: "necklace", slot: "pendant", name: "Подвеска «Крест»", price: 2000, image: "/assets/components/necklace/pendant-cross.png", layerZ: 5 },
  { id: 6, jewelryType: "necklace", slot: "clasp", name: "Карабин", price: 300, image: "/assets/components/necklace/clasp-bracelet.png", layerZ: 8 },
  { id: 7, jewelryType: "necklace", slot: "clasp", name: "Магнитная застёжка", price: 400, image: "/assets/components/necklace/clasp-magnetic.png", layerZ: 8 },
  { id: 8, jewelryType: "necklace", slot: "chain", name: "Чокер", price: 900, image: "/assets/components/necklace/choker.png", layerZ: 1 },
  { id: 9, jewelryType: "necklace", slot: "beads", name: "Бусины из оникса", price: 1100, image: "/assets/components/necklace/beads-onyx.png", layerZ: 3 },
  { id: 10, jewelryType: "necklace", slot: "pendant", name: "Подвеска «Him»", price: 1000, image: "/assets/components/necklace/pendant-him.png", layerZ: 5 },
  { id: 11, jewelryType: "necklace", slot: "pendant", name: "Подвеска «Lilith»", price: 1200, image: "/assets/components/necklace/pendant-lilith.png", layerZ: 5 },
  { id: 12, jewelryType: "necklace", slot: "length", name: "35 см — чокер", price: 0, layerZ: 0 },
  { id: 13, jewelryType: "necklace", slot: "length", name: "60 см — матине", price: 350, layerZ: 0 },

  { id: 14, jewelryType: "bracelet", slot: "beads", name: "Чёрные бусины", price: 1200, image: "/assets/components/bracelet/beads-black.png", layerZ: 1 },
  { id: 15, jewelryType: "bracelet", slot: "beads", name: "Бусины с цепочкой", price: 1300, image: "/assets/components/bracelet/beads-chain.png", layerZ: 1 },
  { id: 16, jewelryType: "bracelet", slot: "beads", name: "Светлые бусины", price: 1400, image: "/assets/components/bracelet/beads-white.png", layerZ: 1 },
  { id: 17, jewelryType: "bracelet", slot: "charm", name: "Шарм «Ангел»", price: 700, image: "/assets/components/bracelet/charm-angel.png", layerZ: 6 },
  { id: 18, jewelryType: "bracelet", slot: "charm", name: "Шарм «Крест»", price: 900, image: "/assets/components/bracelet/charm-cross.png", layerZ: 6 },
  { id: 19, jewelryType: "bracelet", slot: "charm", name: "Шарм «Him»", price: 800, image: "/assets/components/bracelet/charm-him.png", layerZ: 6 },
  { id: 20, jewelryType: "bracelet", slot: "charm", name: "Шарм «Lilith»", price: 800, image: "/assets/components/bracelet/charm-lilith.png", layerZ: 6 },
  { id: 21, jewelryType: "bracelet", slot: "charm", name: "Овальный шарм", price: 650, image: "/assets/components/bracelet/charm-oval.png", layerZ: 6 },
  { id: 22, jewelryType: "bracelet", slot: "charm", name: "Шарм «Звезда»", price: 700, image: "/assets/components/bracelet/charm-star.png", layerZ: 6 },
  { id: 23, jewelryType: "bracelet", slot: "clasp", name: "Карабин", price: 400, image: "/assets/components/bracelet/clasp-bracelet.png", layerZ: 8 },
  { id: 24, jewelryType: "bracelet", slot: "clasp", name: "Застёжка-сердце", price: 450, image: "/assets/components/bracelet/clasp-heart.png", layerZ: 8 },
  { id: 25, jewelryType: "bracelet", slot: "clasp", name: "Магнитная застёжка", price: 450, image: "/assets/components/bracelet/clasp-magnetic.png", layerZ: 8 },
  { id: 26, jewelryType: "bracelet", slot: "size", name: "16 см", price: 0, layerZ: 0 },
  { id: 27, jewelryType: "bracelet", slot: "size", name: "17 см", price: 0, layerZ: 0 },
  { id: 28, jewelryType: "bracelet", slot: "size", name: "18 см", price: 100, layerZ: 0 },

  { id: 29, jewelryType: "earrings", slot: "clasp", name: "Английский замок", price: 900, image: "/assets/components/earrings/lock-english.png", layerZ: 8 },
  { id: 30, jewelryType: "earrings", slot: "clasp", name: "Пуссеты", price: 300, image: "/assets/components/earrings/lock-studs.png", layerZ: 8 },
  { id: 31, jewelryType: "earrings", slot: "stone", name: "Камень «Чёрная роза»", price: 1500, image: "/assets/components/earrings/stone-black-rose.png", layerZ: 5 },
  { id: 32, jewelryType: "earrings", slot: "stone", name: "Камень «Крест»", price: 900, image: "/assets/components/earrings/stone-cross.png", layerZ: 5 },
  { id: 33, jewelryType: "earrings", slot: "stone", name: "Оникс", price: 1000, image: "/assets/components/earrings/stone-onyx.png", layerZ: 5 },
  { id: 34, jewelryType: "earrings", slot: "stone", name: "Жемчуг", price: 1100, image: "/assets/components/earrings/stone-pearle.png", layerZ: 5 },
  { id: 35, jewelryType: "earrings", slot: "length", name: "Короткие (до 2 см)", price: 0, layerZ: 0 },
  { id: 36, jewelryType: "earrings", slot: "length", name: "Средние (3–4 см)", price: 150, layerZ: 0 },
  { id: 37, jewelryType: "earrings", slot: "length", name: "Длинные (5 см и более)", price: 300, layerZ: 0 },

  { id: 38, jewelryType: "ring", slot: "profile", name: "Профиль «Классика», золото", price: 2500, image: "/assets/components/ring/profile-classic-gold.png", layerZ: 1 },
  { id: 39, jewelryType: "ring", slot: "profile", name: "Профиль «Классика», серебро", price: 2300, image: "/assets/components/ring/profile-classic-silver.png", layerZ: 1 },
  { id: 40, jewelryType: "ring", slot: "profile", name: "Профиль «Плоский», золото", price: 2500, image: "/assets/components/ring/profile-flat-gold.png", layerZ: 1 },
  { id: 41, jewelryType: "ring", slot: "profile", name: "Профиль «Плоский», серебро", price: 2300, image: "/assets/components/ring/profile-flat-silver.png", layerZ: 1 },
  { id: 42, jewelryType: "ring", slot: "stone", name: "Оникс, золото", price: 1200, image: "/assets/components/ring/stone-onyx-gold.png", layerZ: 6 },
  { id: 43, jewelryType: "ring", slot: "stone", name: "Оникс, серебро", price: 1200, image: "/assets/components/ring/stone-onyx-silver.png", layerZ: 6 },
  { id: 44, jewelryType: "ring", slot: "stone", name: "Жемчуг", price: 1500, image: "/assets/components/ring/stone-pearl.png", layerZ: 6 },
  { id: 45, jewelryType: "ring", slot: "size", name: "Размер 16", price: 0, layerZ: 0 },
  { id: 46, jewelryType: "ring", slot: "size", name: "Размер 17", price: 0, layerZ: 0 },
  { id: 47, jewelryType: "ring", slot: "size", name: "Размер 18", price: 0, layerZ: 0 },
  { id: 48, jewelryType: "ring", slot: "size", name: "Размер 19", price: 0, layerZ: 0 },
];

export const constructorSlots: Record<JewelrySlug, SlotConfig[]> = {
  necklace: [
    { slot: "chain", title: "Основа" },
    { slot: "beads", title: "Бусины" },
    { slot: "pendant", title: "Подвеска" },
    { slot: "clasp", title: "Застёжка" },
    { slot: "length", title: "Длина" },
  ],
  bracelet: [
    { slot: "beads", title: "Бусины" },
    { slot: "charm", title: "Шармы", multiple: true },
    { slot: "clasp", title: "Застёжка" },
    { slot: "size", title: "Размер" },
  ],
  earrings: [
    { slot: "clasp", title: "Замок" },
    { slot: "stone", title: "Камень" },
    { slot: "length", title: "Длина" },
  ],
  ring: [
    { slot: "profile", title: "Профиль" },
    { slot: "stone", title: "Камень" },
    { slot: "size", title: "Размер" },
  ],
};

export const jewelryTitles: Record<JewelrySlug, string> = {
  necklace: "Колье",
  bracelet: "Браслет",
  earrings: "Серьги",
  ring: "Кольцо",
};

export function getComponentsByType(slug: JewelrySlug): JewelryComponent[] {
  return allComponents.filter((component) => component.jewelryType === slug);
}

export function getComponentsBySlot(slug: JewelrySlug, slot: ComponentSlot): JewelryComponent[] {
  return allComponents.filter((component) => component.jewelryType === slug && component.slot === slot);
}
