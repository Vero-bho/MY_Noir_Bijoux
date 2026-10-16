import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/register";

import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Регистрация — Noir Bijoux" }];
}

export default function RegisterPage() {
  const [notice, setNotice] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("Регистрация отключена. Для оформления заказа аккаунт не нужен.");
  };

  return (
    <div className="grid min-h-[calc(100vh-160px)] lg:grid-cols-2">
      <div className="hidden flex-col justify-center gap-6 border-r border-brand-plum bg-brand-purple/40 p-14 lg:flex">
        <p className="text-8xl leading-none text-brand-mauve">𝒩</p>
        <p className="text-3xl text-brand-white">Noir Bijoux</p>
        <p className="text-2xl text-brand-mauve">Сохраняйте свои украшения и заказы</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-normal">Создать аккаунт</h1>
          <p className="mb-10 mt-3 text-lg text-brand-mauve">Форма регистрации оставлена без подключения</p>

          <form className="space-y-5" onSubmit={submit}>
            <Input label="Имя и фамилия" autoComplete="name" placeholder="Имя Фамилия" />
            <Input label="E-mail" type="email" autoComplete="email" placeholder="mail@example.com" />
            <Input label="Телефон" type="tel" autoComplete="tel" placeholder="+7 (999) 000-00-00" />
            <Input label="Пароль" type="password" autoComplete="new-password" placeholder="••••••••" />
            <Input label="Повторите пароль" type="password" autoComplete="new-password" placeholder="••••••••" />
            <Button type="submit" fullWidth size="lg">
              Зарегистрироваться
            </Button>
          </form>

          {notice && <p className="mt-5 rounded-xl border border-brand-plum p-4 text-brand-mauve">{notice}</p>}

          <p className="mt-8 text-center text-lg text-brand-mauve">
            Уже есть аккаунт? <Link to="/login" className="text-brand-white hover:text-brand-mauve">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
