import type { Route } from "./+types/constructor.necklace";

import ConstructorPage from "~/components/ConstructorPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Конструктор колье — Noir Bijoux" },
    {
      name: "description",
      content: "Соберите колье Noir Bijoux и выберите длину 35 или 60 см.",
    },
  ];
}

export default function ConstructorNecklaceRoute() {
  return <ConstructorPage slug="necklace" />;
}
