import { Separator } from "@/components/ui/separator";
import { Main } from "@/components/layout/Main";
import { /* KeyRound, */ UserRound } from "lucide-react";
import SidebarNav from "./_components/SidebarNav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Main fixed>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Configuración
        </h1>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta y establece las preferencias de
          correo electrónico.
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-2 md:space-y-2 overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex w-full p-1 pr-4 overflow-y-hidden">{children}</div>
      </div>
    </Main>
  );
}

const sidebarNavItems = [
  {
    title: "Cuenta",
    icon: <UserRound size={18} />,
    href: "/account",
  },
  /*   {
    title: 'Permisos',
    icon: <KeyRound size={18} />,
    href: '/account/permissions',
  }, */
];
