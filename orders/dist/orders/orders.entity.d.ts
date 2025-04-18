import { STATUS } from './orders.enums';
export declare class Order {
    constructor(product: number, quantity: number);
    id: number;
    product: number;
    quantity: number;
    status: STATUS;
}
