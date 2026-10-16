import { useCallback, useEffect, useMemo, useState } from "react";

import type { CartItem, ComponentSlot, JewelryComponent, JewelrySlug, SavedBuild } from "~/types";
import { constructorSlots, getComponentsByType, jewelryTitles } from "~/data/constructorComponents";
import { api } from "~/lib/api";
import { buildArticle } from "~/lib/format";
import { useCart } from "./useCart";
import { useBuilds } from "./useBuilds";

export interface ConstructorState {
  slug: JewelrySlug;
  title: string;
  tabs: { slot: ComponentSlot; title: string; multiple?: boolean }[];
  activeSlot: ComponentSlot;
  setActiveSlot: (slot: ComponentSlot) => void;

  activeComponents: JewelryComponent[];

  selected: JewelryComponent[];
  isSelected: (component: JewelryComponent) => boolean;
  toggle: (component: JewelryComponent) => void;
  clear: () => void;

  layers: JewelryComponent[];

  textOptions: JewelryComponent[];
  total: number;
  article: string;
  isReady: boolean;
  canSave: boolean;
  addToCart: () => void;
  save: () => void;
  saved: boolean;
  missingSlots: string[];
}

export function useConstructor(slug: JewelrySlug): ConstructorState {
  const tabs = constructorSlots[slug];
  const [remoteComponents, setRemoteComponents] = useState<JewelryComponent[] | null>(null);
  const [activeSlot, setActiveSlot] = useState<ComponentSlot>(tabs[0].slot);
  const [selectedIds, setSelectedIds] = useState<Record<string, number[]>>({});

  useEffect(() => {
    let active = true;
    setRemoteComponents(null);
    setSelectedIds({});
    setActiveSlot(tabs[0].slot);

    api
      .get<{ items?: Array<Partial<JewelryComponent>> }>(`/components?type=${encodeURIComponent(slug)}`)
      .then((response) => {
        const rows = (response.items ?? []).map((row) => ({
          id: Number(row.id),
          name: String(row.name ?? ""),
          jewelryType: row.jewelryType as JewelrySlug,
          slot: row.slot as ComponentSlot,
          price: Number(row.price ?? 0),
          image: row.image ? String(row.image) : undefined,
          layerZ: Number(row.layerZ ?? 0),
        }));
        if (active && rows.length > 0) setRemoteComponents(rows);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [slug, tabs]);

  const components = useMemo(
    () => remoteComponents ?? getComponentsByType(slug),
    [remoteComponents, slug],
  );

  const { addItem } = useCart();
  const { saveBuild, isSaved } = useBuilds();

  const isMultiple = useCallback(
    (slot: ComponentSlot) => Boolean(tabs.find((tab) => tab.slot === slot)?.multiple),
    [tabs],
  );

  const toggle = useCallback(
    (component: JewelryComponent) => {
      setSelectedIds((prev) => {
        const current = prev[component.slot] ?? [];
        if (isMultiple(component.slot)) {
          const next = current.includes(component.id)
            ? current.filter((id) => id !== component.id)
            : [...current, component.id];
          return { ...prev, [component.slot]: next };
        }
        const next = current.includes(component.id) ? [] : [component.id];
        return { ...prev, [component.slot]: next };
      });
    },
    [isMultiple],
  );

  const clear = useCallback(() => setSelectedIds({}), []);

  const selected = useMemo(
    () =>
      Object.values(selectedIds)
        .flat()
        .map((id) => components.find((component) => component.id === id))
        .filter((component): component is JewelryComponent => Boolean(component)),
    [selectedIds, components],
  );

  const layers = useMemo(
    () =>
      selected
        .filter((component) => Boolean(component.image))
        .sort((a, b) => a.layerZ - b.layerZ),
    [selected],
  );

  const textOptions = useMemo(() => selected.filter((component) => !component.image), [selected]);

  const total = useMemo(
    () => selected.reduce((sum, component) => sum + component.price, 0),
    [selected],
  );

  const article = useMemo(
    () =>
      buildArticle(
        slug,
        [...selected].map((component) => component.id).sort((a, b) => a - b),
      ),
    [slug, selected],
  );

  const missingSlots = useMemo(
    () =>
      tabs
        .filter((tab) => !(selectedIds[tab.slot]?.length > 0))
        .map((tab) => tab.title.toLowerCase()),
    [tabs, selectedIds],
  );

  const canSave = selected.length > 0;

  const toSavedBuild = useCallback(
    (): SavedBuild => ({
      id: `build-${article}`,
      article,
      jewelryType: slug,
      jewelryTitle: jewelryTitles[slug],
      totalPrice: total,
      createdAt: new Date().toISOString(),
      components: selected.map((component) => ({
        name: component.name,
        price: component.price,
        slot: component.slot,
        image: component.image,
        layerZ: component.layerZ,
      })),
    }),
    [article, slug, total, selected],
  );

  const addToCart = useCallback(() => {
    const build = toSavedBuild();
    const cartItem: Omit<CartItem, "quantity"> = {
      key: `build-${build.article}`,
      kind: "build",
      id: Number(build.id.replace(/\D/g, "")) || Date.now(),
      name: `${build.jewelryTitle} (авторская сборка ${build.article})`,
      price: build.totalPrice,
      article: build.article,
      image: build.components.find((component) => component.image)?.image,
    };
    addItem(cartItem);
  }, [toSavedBuild, addItem]);

  const save = useCallback(() => {
    saveBuild(toSavedBuild());
  }, [saveBuild, toSavedBuild]);

  return {
    slug,
    title: jewelryTitles[slug],
    tabs,
    activeSlot,
    setActiveSlot,
    activeComponents: components.filter((component) => component.slot === activeSlot),
    selected,
    isSelected: (component) => (selectedIds[component.slot] ?? []).includes(component.id),
    toggle,
    clear,
    layers,
    textOptions,
    total,
    article,
    isReady: selected.length > 0,
    canSave,
    addToCart,
    save,
    saved: isSaved(article),
    missingSlots,
  };
}
