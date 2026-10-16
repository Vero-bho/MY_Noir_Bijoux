import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/login";

import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Вход — Noir Bijoux" }];
}

export default function LoginPage() {
  const [notice, setNotice] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("Авторизация отключена. Заказы можно оформлять без аккаунта.");
  };

  return (
    <div className="grid min-h-[calc(100vh-160px)] lg:grid-cols-2">
      <div className="hidden flex-col justify-center gap-6 border-r border-brand-plum bg-brand-purple/40 p-14 lg:flex">
        <p className="text-8xl leading-none text-brand-mauve">𝒩</p>
        <p className="text-3xl text-brand-white">Noir Bijoux</p>
        <p className="text-2xl text-brand-mauve">Искусство создания уникальных украшений</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-normal">Войти</h1>
          <p className="mb-10 mt-3 text-lg text-brand-mauve">Страница сохранена, но вход отключён</p>

          <form className="space-y-6" onSubmit={submit}>
            <Input label="E-mail" type="email" autoComplete="email" placeholder="mail@example.com" />
            <Input label="Пароль" type="password" autoComplete="current-password" placeholder="••••••••" />
            <Button type="submit" fullWidth size="lg">
              Войти
            </Button>
          </form>

          {notice && <p className="mt-5 rounded-xl border border-brand-plum p-4 text-brand-mauve">{notice}</p>}

          <p className="mt-8 text-center text-lg text-brand-mauve">
            Нет аккаунта? <Link to="/register" className="text-brand-white hover:text-brand-mauve">Регистрация</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
