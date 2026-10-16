import { useState } from "react";
import { Link, NavLink } from "react-router";

import { useCart } from "~/hooks/useCart";

const NAV_ITEMS = [
  { to: "/catalog", label: "Каталог" },
  { to: "/constructor", label: "Конструктор" },
  { to: "/about", label: "О мастере" },
  { to: "/profile/history", label: "Заказы" },
];

export default function Header() {
  const { count, toast } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-brand-white" : "text-brand-mauve transition-colors hover:text-brand-white";

  return (
    <header className="sticky top-0 z-40 border-b border-brand-plum bg-brand-purple/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link to="/" className="flex items-center gap-3 text-2xl tracking-widest md:text-3xl">
          <span className="text-4xl text-brand-mauve md:text-5xl">𝒩</span>
          <span className="whitespace-nowrap">Noir Bijoux</span>
        </Link>

        <nav className="hidden items-center gap-6 text-xl lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-lg md:text-xl">
          <NavLink to="/login" className={linkClass}>
            Войти
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Корзина ({count})
          </NavLink>
          <button
            type="button"
            aria-label="Меню"
            aria-expanded={menuOpen}
            className="text-2xl text-brand-mauve lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-4 border-t border-brand-plum px-6 py-5 text-xl lg:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
            Войти
          </NavLink>
          <NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>
            Регистрация
          </NavLink>
          <NavLink to="/profile/settings" className={linkClass} onClick={() => setMenuOpen(false)}>
            Настройки профиля
          </NavLink>
        </nav>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-brand-mauve bg-brand-plum px-6 py-4 text-lg text-brand-white shadow-2xl">
          {toast}
        </div>
      )}
    </header>
  );
}
