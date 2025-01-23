import {
  BookPlus,
  Boxes,
  CalendarPlus,
  CalendarRange,
  Clock,
  DollarSign,
  FileHeart,
  FileText,
  Handshake,
  Hospital,
  KeyRound,
  ListTodo,
  Package,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  ShieldBan,
  ShieldCheck,
  ShieldPlus,
  Tag,
  User,
  UserPlus,
  UserRound,
  UserRoundSearch,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Inicio",
          url: "/",
          icon: Hospital,
        },
      ],
    },
    {
      title: "Registros Operativos",
      items: [
        {
          title: "Gestión de Citas",
          icon: CalendarPlus,
          items: [
            {
              title: "Consultas",
              url: "/consultations",
              icon: Handshake,
            },
            {
              title: "Citas",
              url: "/appointments",
              icon: CalendarPlus,
            },
          ],
        },
        {
          title: "Procedimientos",
          icon: ShieldPlus,
          items: [
            {
              title: "Activos",
              url: "/medical-records",
              icon: ShieldCheck,
            },
            {
              title: "Finalizados",
              url: "/prescriptions",
              icon: ShieldBan,
            },
          ],
        },
      ],
    },
    {
      title: "Pacientes",
      items: [
        {
          title: "Gestión de Pacientes",
          icon: UserRound,
          items: [
            {
              title: "Pacientes",
              url: "/patients",
              icon: UserPlus,
            },
            {
              title: "Clientes",
              url: "/clients",
              icon: UserRound,
            },
          ],
        },
        {
          title: "Documentación",
          icon: FileText,
          items: [
            {
              title: "Historias Clinicas",
              url: "/medical-records",
              icon: BookPlus,
            },
            {
              title: "Recetas médicas",
              url: "/prescriptions",
              icon: FileHeart,
            },
          ],
        },
      ],
    },
    {
      title: "Ordenes y Pagos",
      items: [
        {
          title: "Gestión de Pagos",
          icon: DollarSign,
          items: [
            {
              title: "Ordenes",
              url: "/order",
              icon: FileText,
            },
            {
              title: "Pagos",
              url: "/invoices",
              icon: DollarSign,
            },
          ],
        },
      ],
    },
    {
      title: "Inventario",
      items: [
        {
          title: "Gestión de Inventario",
          icon: Package,
          items: [
            {
              title: "Stock",
              url: "/stock",
              icon: PackageOpen,
            },
            {
              title: "Entradas",
              url: "/entries",
              icon: PackagePlus,
            },
            {
              title: "Salidas",
              url: "/exits",
              icon: PackageMinus,
            },
          ],
        },
      ],
    },
    {
      title: "Personal y Horarios",
      items: [
        {
          title: "Gestión de Personal",
          icon: UserRoundSearch,
          items: [
            {
              title: "Personal",
              url: "/staff",
              icon: UserRoundSearch,
            },
            {
              title: "Cronograma",
              url: "/timetable",
              icon: CalendarRange,
            },
            {
              title: "Horarios",
              url: "/schedules",
              icon: Clock,
            },
          ],
        },
      ],
    },
    {
      title: "Catálogo",
      items: [
        {
          title: "Productos",
          icon: Package,
          items: [
            {
              title: "Productos",
              url: "/product/products",
              icon: Package,
            },
            {
              title: "Categorías",
              url: "/product/categorys",
              icon: Tag,
            },
            {
              title: "Tipos",
              url: "/product/product-types",
              icon: Boxes,
            },
          ],
        },

        {
          title: "Servicios",
          url: "/services",
          icon: ListTodo,
        },
        {
          title: "Sucursales",
          url: "/branches",
          icon: Hospital,
        },
      ],
    },
    {
      title: "Accesos y Usuarios",
      items: [
        {
          title: "Gestión de Accesos",
          icon: KeyRound,
          items: [
            {
              title: "Usuarios",
              url: "/users",
              icon: User,
            },
            {
              title: "Permisos",
              url: "/permissions",
              icon: KeyRound,
            },
          ],
        },
      ],
    },
  ],
};
