import {
  BookPlus,
  Boxes,
  CalendarPlus,
  CalendarRange,
  ClipboardType,
  Clock,
  DollarSign,
  FileText,
  Handshake,
  Home,
  Hospital,
  HousePlus,
  KeyRound,
  Package,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  PackageSearch,
  Pill,
  ShieldBan,
  ShieldCheck,
  ShieldPlus,
  Stethoscope,
  Tag,
  User,
  UserPen,
  UserPlus,
  UserRound,
  UserRoundSearch,
  Warehouse,
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
          icon: Home,
        },
        {
          title: "Calendario Citas",
          url: "/appointments-schedule",
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
      title: "Registros Operativos",
      items: [
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
              url: "/patient",
              icon: UserPlus,
            },
            /*             {
                          title: "Clientes",
                          url: "/clients",
                          icon: UserRound,
                        }, */
            {
              title: "Historial Médico",
              url: "/history",
              icon: BookPlus,
            },
            /*             {
                          title: "Recetas médicas",
                          url: "/prescriptions",
                          icon: FileHeart,
                        }, */
          ],
        },
        // {
        //   title: "Documentación",
        //   icon: FileText,
        //   items: [
        //     {
        //       title: "Historias Clinicas",
        //       url: "/medical-records",
        //       icon: BookPlus,
        //     },
        //     {
        //       title: "Recetas médicas",
        //       url: "/prescriptions",
        //       icon: FileHeart,
        //     },
        //   ],
        // },
      ],
    },
    {
      title: "Órdenes y Pagos",
      items: [
        {
          title: "Gestión de Pagos",
          icon: DollarSign,
          items: [
            {
              title: "Recetas",
              url: "/prescriptions",
              icon: Pill,
            },
            {
              title: "Órdenes",
              url: "/orders",
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
              url: "/income",
              icon: PackagePlus,
            },
            {
              title: "Salidas",
              url: "/outgoing",
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
              title: "Tipos de Personal",
              url: "/staff/types",
              icon: UserPen,
            },
            {
              title: "Cronograma",
              url: "/schedules",
              icon: CalendarRange,
            },
            {
              title: "Turnos",
              url: "/staff-schedules",
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
          icon: PackageSearch,
          items: [
            {
              title: "Productos",
              url: "/product/products",
              icon: PackageSearch,
            },
            {
              title: "Categorías",
              url: "/product/category",
              icon: Tag,
            },
            {
              title: "Subcategorías",
              url: "/product/product-types",
              icon: Boxes,
            },
          ],
        },
        {
          title: "Almacenamiento",
          icon: Warehouse,
          items: [
            {
              title: "Almacenes",
              url: "/storage/storages",
              icon: Warehouse,
            },
            {
              title: "Tipos de Almacén",
              url: "/storage/storage-types",
              icon: HousePlus,
            },
          ],
        },
        {
          title: "Servicios",
          icon: Stethoscope,
          items: [
            {
              title: "Servicios",
              url: "/services",
              icon: Stethoscope,
            },
            {
              title: "Tipos de Servicios",
              url: "/services/types",
              icon: ClipboardType,
            },
          ],
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