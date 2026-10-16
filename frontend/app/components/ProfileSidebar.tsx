import { NavLink } from "react-router";

const LINKS = [
  { to: "/profile/history", label: "История заказов" },
  { to: "/profile/favorites", label: "Сохранённые сборки" },
  { to: "/profile/settings", label: "Настройки профиля" },
];

export default function ProfileSidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block rounded-xl border px-5 py-3 text-lg transition-colors",
      isActive
        ? "border-brand-mauve bg-brand-plum text-brand-white"
        : "border-brand-plum text-brand-mauve hover:border-brand-mauve hover:text-brand-white",
    ].join(" ");

  return (
    <aside className="h-fit space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-brand-plum bg-brand-purple/40 p-5">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-brand-mauve bg-brand-plum text-2xl text-brand-mauve">
          𝒩
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl text-brand-white">Профиль</p>
          <p className="truncate text-brand-mauve">Авторизация отключена</p>
        </div>
      </div>

      <nav className="space-y-3">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
