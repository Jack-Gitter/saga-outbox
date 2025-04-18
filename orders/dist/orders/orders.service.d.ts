import { DataSource } from 'typeorm';
export declare class OrdersService {
    private dataSource;
    constructor(dataSource: DataSource);
    initiateOrder(product: number, quantity: number): Promise<void>;
}
