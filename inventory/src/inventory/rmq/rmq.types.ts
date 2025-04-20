export const INVENTORY_RESERVE = 'INVENTORY_RESERVE';
export const INVENTORY_RESERVE_RESP = 'INVENTORY_RESERVE_RESP';
export const INVENTORY_REMOVE = 'INVENTORY_REMOVE';
export const INVENTORY_REMOVE_RESP = 'INVENTORY_REMOVE_RESP';
export type InventoryReserveInboxMessage = {
  orderId: number;
  product: number;
  quantity: number;
};
export type InventoryDeleteInboxMessage = {
  orderId: number;
  product: number;
  quantity: number;
};
