export const INVENTORY_RESERVE = 'INVENTORY_RESERVE';
export type InventoryReserveMessage = {
  orderId: number;
  product: number;
  quantity: number;
};
