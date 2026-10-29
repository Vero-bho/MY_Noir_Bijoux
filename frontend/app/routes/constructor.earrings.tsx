import type { Route } from "./+types/constructor.earrings";

import ConstructorPage from "~/components/ConstructorPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Конструктор серёг — Noir Bijoux" },
    {
      name: "description",
      content: "Создайте серьги Noir Bijoux, выбирая основу и декоративные элементы.",
    },
  ];
}

export default function ConstructorEarringsRoute() {
  return <ConstructorPage slug="earrings" />;
}
