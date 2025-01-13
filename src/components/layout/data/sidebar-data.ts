import {
  BookPlus,
  BookUser,
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
          title: "Dashboard",
          url: "/",
          icon: Hospital,
        },
      ],
    },
    {
      title: "Citas y Consultas",
      items: [
        {
          title: "Consultas",
          url: "/consultationss",
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
      title: "Clientes y Pacientes",
      items: [
        {
          title: "Clientes",
          url: "/clients",
          icon: UserRound,
        },
        {
          title: "Pacientes",
          url: "/patients",
          icon: UserPlus,
        },
        {
          title: "Registros médicos",
          url: "/medical-records",
          icon: BookPlus,
        },
        {
          title: "Prescripciones",
          url: "/prescriptions",
          icon: FileHeart,
        },
      ],
    },
    {
      title: "Ventas y Pagos",
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
    {
      title: "Inventario",
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
    {
      title: "Personal y Horarios",
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
              url: "/product/categories",
              icon: Tag,
            },
            {
              title: "Tipos",
              url: "/product/types",
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
      title: "Administración",
      items: [
        {
          title: "Usuarios",
          url: "/users",
          icon: User,
        },
        {
          title: "Roles",
          url: "/roles",
          icon: BookUser,
        },
        {
          title: "Permisos",
          url: "/permissions",
          icon: KeyRound,
        },
      ],
    },
  ],
};
