import {
    Users,
    LucideIcon,
    BookUser,
    User,
    KeyRound,
    Container,
    Hospital,
    ListTodo,
    Package,
    Package2,
    PackagePlus,
    PackageMinus,
    PackageOpen,
    Receipt,
    DollarSign,
    FileText,
    CalendarRange,
    CalendarPlus,
    Clock,
    UserRoundSearch,
    UserRound,
    UserPlus,
    BookPlus,
    FileHeart,
    CalendarHeart,
    CalendarClock,
    Stethoscope,
    HeartPulse,
    ClipboardPlus,
    Handshake,
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/",
                    label: "Inicio",
                    active: "/" === pathname,
                    icon: Hospital,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Cita",
            menus: [
                {
                    href: "/users",
                    label: "Reservas",
                    active: pathname.includes("/users"),
                    icon: CalendarHeart,
                    submenus: [
                        {
                            href: "/users/permissions",
                            label: "Registrar Consulta",
                            active: pathname.includes("/permissions"),
                            icon: Handshake,
                        },
                        {
                            href: "/users/permissions",
                            label: "Registrar Cita",
                            active: pathname.includes("/permissions"),
                            icon: CalendarPlus,
                        },
                        {
                            href: "/users/roles",
                            label: "Citas Medicas",
                            active: pathname.includes("/roles"),
                            icon: CalendarClock,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Procedimientos",
            menus: [
                {
                    href: "/users",
                    label: "Procedimientos",
                    active: pathname.includes("/users"),
                    icon: HeartPulse,
                    submenus: [
                        {
                            href: "/users/roles",
                            label: "Procesos Medicos",
                            active: pathname.includes("/roles"),
                            icon: Stethoscope,
                        },
                        {
                            href: "/users/permissions",
                            label: "Registro Procedimientos",
                            active: pathname.includes("/permissions"),
                            icon: ClipboardPlus,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Clientes",
            menus: [
                {
                    href: "/users",
                    label: "Clientes",
                    active: pathname.includes("/users"),
                    icon: Users,
                    submenus: [
                        {
                            href: "/users/roles",
                            label: "Cliente",
                            active: pathname.includes("/roles"),
                            icon: UserRound,
                        },
                        {
                            href: "/users/roles",
                            label: "Paciente",
                            active: pathname.includes("/roles"),
                            icon: UserPlus,
                        },
                        {
                            href: "/users/roles",
                            label: "Historias",
                            active: pathname.includes("/roles"),
                            icon: BookPlus,
                        },
                        {
                            href: "/users/permissions",
                            label: "Recetas",
                            active: pathname.includes("/permissions"),
                            icon: FileHeart,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Ventas",
            menus: [
                {
                    href: "/users",
                    label: "Registros",
                    active: pathname.includes("/users"),
                    icon: Receipt,
                    submenus: [
                        {
                            href: "/users/roles",
                            label: "Orden",
                            active: pathname.includes("/roles"),
                            icon: FileText,
                        },
                        {
                            href: "/users/permissions",
                            label: "Pago",
                            active: pathname.includes("/permissions"),
                            icon: DollarSign,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Inventario",
            menus: [
                {
                    href: "/users",
                    label: "Almacen",
                    active: pathname.includes("/users"),
                    icon: Package2,
                    submenus: [
                        {
                            href: "/users",
                            label: "Stock",
                            active: pathname === "/users",
                            icon: PackageOpen,
                        },
                        {
                            href: "/users/roles",
                            label: "Ingresos",
                            active: pathname.includes("/roles"),
                            icon: PackagePlus,
                        },
                        {
                            href: "/users/permissions",
                            label: "Salidas",
                            active: pathname.includes("/permissions"),
                            icon: PackageMinus,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Personal",
            menus: [
                {
                    href: "/users",
                    label: "Horarios",
                    active: pathname.includes("/users"),
                    icon: CalendarPlus,
                    submenus: [
                        {
                            href: "/users/roles",
                            label: "Personal",
                            active: pathname.includes("/roles"),
                            icon: UserRoundSearch,
                        },
                        {
                            href: "/users/roles",
                            label: "Cronograma",
                            active: pathname.includes("/roles"),
                            icon: CalendarRange,
                        },
                        {
                            href: "/users/permissions",
                            label: "Horario",
                            active: pathname.includes("/permissions"),
                            icon: Clock,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Catalogo",
            menus: [
                {
                    href: "/users",
                    label: "Catalogo",
                    active: pathname.includes("/users"),
                    icon: Container,
                    submenus: [
                        {
                            href: "/users",
                            label: "Productos",
                            active: pathname === "/users",
                            icon: Package,
                        },
                        {
                            href: "/users/roles",
                            label: "Servicios",
                            active: pathname.includes("/roles"),
                            icon: ListTodo,
                        },
                        {
                            href: "/users/permissions",
                            label: "Sucursales",
                            active: pathname.includes("/permissions"),
                            icon: Hospital,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Administracion",
            menus: [
                {
                    href: "/users",
                    label: "Usuarios",
                    active: pathname.includes("/users"),
                    icon: Users,
                    submenus: [
                        {
                            href: "/users",
                            label: "Usuarios",
                            active: pathname === "/users",
                            icon: User,
                        },
                        {
                            href: "/users/roles",
                            label: "Roles",
                            active: pathname.includes("/roles"),
                            icon: BookUser,
                        },
                        {
                            href: "/users/permissions",
                            label: "Permisos",
                            active: pathname.includes("/permissions"),
                            icon: KeyRound,
                        },
                    ],
                },
            ],
        },
    ];
}
