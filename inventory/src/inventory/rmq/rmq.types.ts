export const INVENTORY_RESERVE = 'INVENTORY_RESERVE';
export const INVENTORY_RESERVE_RESP = 'INVENTORY_RESERVE_RESPONSE';
export const INVENTORY_REMOVE = 'INVENTORY_REMOVE';
export const INVENTORY_REMOVE_RESP = 'INVENTORY_REMOVE_RESPONSE';
export type InventoryReserveInboxMessage = {
  orderId: number;
  product: number;
  quantity: number;
};
export type InventoryRemoveInboxMessage = {
  orderId: number;
  product: number;
  quantity: number;
};
