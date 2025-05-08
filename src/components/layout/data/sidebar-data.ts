import {
  BookPlus,
  Boxes,
  CalendarPlus,
  CalendarRange,
  ClipboardType,
  Clock,
  DollarSign,
  FileHeart,
  HandCoins,
  Handshake,
  Home,
  Hospital,
  HousePlus,
  KeyRound,
  ListTodo,
  Package,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  PackageSearch,
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
import { type Profile } from "@/app/(auth)/sign-in/_interfaces/auth.interface";

// Datos completos de la barra lateral
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
          title: "Consultas",
          url: "/consultations",
          icon: Handshake,
        },
        {
          title: "Gestión de Citas",
          icon: CalendarPlus,
          items: [
            {
              title: "Calendario",
              url: "/appointments-schedule",
              icon: CalendarRange,
            },
            {
              title: "Lista de Citas",
              url: "/appointments",
              icon: CalendarPlus,
            },
          ],
        }

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
              url: "/apoointment-medical",
              icon: ShieldCheck,
            },
            {
              title: "Finalizados",
              url: "/apoointment-medical-complete",
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
              title: "Cotizaciones / Pagos",
              url: "/orders",
              icon: ListTodo,
            },
            {
              title: "Recetas medicas",
              url: "/prescriptions",
              icon: FileHeart,
            },
            {
              title: "Venta de productos",
              url: "/productSale",
              icon: HandCoins,
            },
         
           /*  {
              title: "Pagos",
              url: "/invoices",
              icon: DollarSign,
            }, */
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
              title: "Calendario Medico",
              url: "/schedules",
              icon: CalendarRange,
            },
            {
              title: "Crear Turnos",
              url: "/staff-schedules",
              icon: Clock,
            },
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
            /*     {
                  title: "Permisos",
                  url: "/permissions",
                  icon: KeyRound,
                }, */
          ],
        },
      ],
    },
  ],
};

/**
 * Función que filtra los elementos de la barra lateral según el rol del usuario
 * @param profile - Perfil del usuario actual
 * @returns Datos filtrados de la barra lateral
 */
export function getFilteredSidebarData(profile: Profile | null): SidebarData {
  // Si no hay perfil, mostrar estructura básica
  if (!profile) {
    return sidebarData;
  }

  // Si es superadmin, mostrar todo
  if (profile.isSuperAdmin) {
    return {
      user: {
        name: profile.name,
        email: profile.email,
        avatar: "/avatars/shadcn.jpg",
      },
      navGroups: sidebarData.navGroups
    };
  }

  // Obtener el rol principal del usuario
  const userRole = profile.roles.length > 0 ? profile.roles[0].name : "";

  // Crear una copia de los grupos de navegación
  let filteredNavGroups = [...sidebarData.navGroups];

  // Filtrar según el rol
  if (userRole === "ADMINISTRATIVO") {
    // Administrativo: Todo excepto "Accesos y Usuarios"
    filteredNavGroups = filteredNavGroups.filter(
      (group) => group.title !== "Accesos y Usuarios"
    );
  } else if (userRole === "MEDICO") {
    // Médico: Solo "Registros Operativos"
    filteredNavGroups = filteredNavGroups.filter(
      (group) => group.title === "Registros Operativos"
    );
  }

  // Retornar los datos filtrados
  return {
    user: {
      name: profile.name,
      email: profile.email,
      avatar: "/avatars/shadcn.jpg",
    },
    navGroups: filteredNavGroups,
  };
}