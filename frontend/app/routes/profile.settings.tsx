import type { Route } from "./+types/profile.settings";
import { Link } from "react-router";

import ProfileSidebar from "~/components/ProfileSidebar";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import SectionTitle from "~/components/ui/SectionTitle";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Настройки профиля — Noir Bijoux" }];
}

export default function ProfileSettingsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 md:py-16">
      <SectionTitle title="Настройки профиля" subtitle="Страница сохранена; управление аккаунтом отключено" />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar />
        <div className="space-y-6 rounded-2xl border border-brand-plum bg-brand-purple/40 p-6">
          <p className="text-lg text-brand-mauve">
            Вход, регистрация и изменение данных профиля сейчас отключены. Корзина и оформление заказа доступны без аккаунта.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Имя" disabled placeholder="Недоступно" />
            <Input label="Телефон" disabled placeholder="Недоступно" />
          </div>
          <Input label="E-mail" type="email" disabled placeholder="Недоступно" />
          <div className="flex flex-wrap gap-3">
            <Button to="/login" variant="outline">Страница входа</Button>
            <Button to="/register" variant="ghost">Страница регистрации</Button>
          </div>
          <p className="text-sm text-brand-mauve/70">
            <Link to="/profile/history" className="hover:text-brand-white">Перейти к заказам</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
