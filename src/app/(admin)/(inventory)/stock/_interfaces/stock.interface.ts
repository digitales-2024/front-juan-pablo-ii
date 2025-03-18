import { components } from "@/types/api";
// import { z } from "zod";

// Tipos para el modulo stock
export type StockByStoragePrototype = components['schemas']['StockByStorage'];
export type ProductStockResponsePrototype = components['schemas']['ProductStockResponse'];
export type ProductStock = {
  idProduct: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  totalPrice: number;
}
export type StockByStorage = {
  idStorage: string;
  name: string;
  location: string;
  address: string;
  staff: string;
  description: string;
  stock: ProductStock[];
}

export type StockStorageBranchPrototype = components['schemas']['StockStorageBranch'];
export type StockStorageBranch = {
  id: string;
  name: string;
};

// Tipos para el modulo Outgoing
export type StorageStockPrototype = components['schemas']['StockStorage']
export type StockStorage = {
  id: string;
  name: string;
  branch?: StockStorageBranch;
}
export type ProductStockDataPrototype = components['schemas']['StockProduct']
export type ProductStockData = {
  stock: number;
  isActive: boolean;
  Storage: StockStorage;
}
export type OutgoingProductStockPrototype = components['schemas']['ProductStock']
export type OutgoingProductStock = {
  id: string;
  name: string;
  precio: number;
  codigoProducto: string;
  uso: "VENTA" | "INTERNO" | "OTRO";
  unidadMedida: string;
  Stock: ProductStockData[];
}

export interface OutgoingProducStockForm extends OutgoingProductStock{
  storageId: string;
}
