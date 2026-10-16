import type { CatalogProduct, JewelryType, JewelryTypeInfo } from "~/types";

export const catalogProducts: CatalogProduct[] = [
  {
    id: 1,
    name: "Браслет «Dark Star»",
    slug: "bracelet-dark-star",
    type: "Браслет",
    typeSlug: "bracelet",
    material: "Ювелирный сплав",
    price: 3200,
    image: "/assets/catalog/bracelet-dark-star.png",
    description: "Браслет из тёмных бусин с шармом-звездой. Доступны размеры 16, 17 и 18 см.",
  },
  {
    id: 2,
    name: "Браслет «Лилит»",
    slug: "bracelet-lilith",
    type: "Браслет",
    typeSlug: "bracelet",
    material: "Серебро 925",
    price: 3900,
    image: "/assets/catalog/bracelet-lilith.png",
    description: "Жемчужный браслет с серебряным шармом. Доступны размеры 16, 17 и 18 см.",
  },
  {
    id: 3,
    name: "Серьги «Чёрная роза»",
    slug: "earrings-black-rose",
    type: "Серьги",
    typeSlug: "earrings",
    material: "Чёрный родий",
    price: 3400,
    image: "/assets/catalog/earrings-black-rose.png",
    description: "Серьги с тёмными камнями и фурнитурой с покрытием чёрным родием.",
  },
  {
    id: 4,
    name: "Колье «Оникс капля»",
    slug: "necklace-onyx-drop",
    type: "Колье",
    typeSlug: "necklace",
    material: "Серебро 925",
    price: 5200,
    image: "/assets/catalog/necklace-onyx-drop.png",
    description: "Колье с подвеской из чёрного оникса. Доступны длины 35 см — чокер и 60 см — матине.",
  },
  {
    id: 5,
    name: "Колье «Ночная Роза»",
    slug: "necklace-rose",
    type: "Колье",
    typeSlug: "necklace",
    material: "Серебро 925",
    price: 4500,
    image: "/assets/catalog/necklace-rose.png",
    description: "Колье на цепочке с подвеской-розой. Доступны длины 35 см — чокер и 60 см — матине.",
  },
];

export const productTypes: JewelryType[] = ["Колье", "Браслет", "Серьги", "Кольцо"];

export const productMaterials: string[] = [
  "Серебро 925",
  "Ювелирный сплав",
  "Чёрный родий",
];

export const jewelryTypes: JewelryTypeInfo[] = [
  {
    type: "Колье",
    slug: "necklace",
    icon: "𝒩",
    description: "Создайте уникальное ожерелье, выбрав основу, подвески, бусины и фурнитуру.",
    image: "/assets/catalog/necklace-rose.png",
  },
  {
    type: "Браслет",
    slug: "bracelet",
    icon: "𝒷",
    description: "Соберите браслет из бусин, шармов и подходящей застёжки.",
    image: "/assets/catalog/bracelet-dark-star.png",
  },
  {
    type: "Кольцо",
    slug: "ring",
    icon: "𝒪",
    description: "Выберите профиль, камень и размер кольца.",
    image: "/assets/components/ring/profile-classic-silver.png",
  },
  {
    type: "Серьги",
    slug: "earrings",
    icon: "ℯ",
    description: "Сконструируйте серьги, сочетая замки и камни.",
    image: "/assets/catalog/earrings-black-rose.png",
  },
];

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}
