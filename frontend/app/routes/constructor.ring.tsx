import type { Route } from "./+types/constructor.ring";

import ConstructorPage from "~/components/ConstructorPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Конструктор кольца — Noir Bijoux" },
    {
      name: "description",
      content: "Соберите кольцо Noir Bijoux, выбрав профиль, камень и размер 16, 17, 18 или 19.",
    },
  ];
}

export default function ConstructorRingRoute() {
  return <ConstructorPage slug="ring" />;
}
