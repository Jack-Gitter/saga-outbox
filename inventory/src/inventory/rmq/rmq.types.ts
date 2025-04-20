export const INVENTORY_RESERVE = 'INVENTORY_RESERVE';
export const INVENTORY_RESERVE_RESP = 'INVENTORY_RESERVE_RESP';
export type InventoryReserveInboxMessage = {
  orderId: number;
  product: number;
  quantity: number;
};
