export const SHIPPING_VALIDATION = 'SHIPPING_VALIDATION';
export const SHIPPING_VALIDATION_RESPONSE = 'SHIPPING_VALIDATION_RESPONSE';

export type ShippingValidationMessage = {
  orderId: number;
  product: number;
  quantity: number;
};

export type ShippingValidationResponse = {
  orderId: number;
  successful: boolean;
};
