import type { Route } from "./+types/constructor.bracelet";

import ConstructorPage from "~/components/ConstructorPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Конструктор браслета — Noir Bijoux" },
    {
      name: "description",
      content: "Соберите браслет Noir Bijoux и выберите размер 16, 17 или 18 см.",
    },
  ];
}

export default function ConstructorBraceletRoute() {
  return <ConstructorPage slug="bracelet" />;
}
