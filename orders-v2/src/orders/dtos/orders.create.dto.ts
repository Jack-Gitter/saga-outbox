import { IsNumber } from 'class-validator';
export class CreateOrderDTO {
  @IsNumber()
  product: number;

  @IsNumber()
  quantity: number;
}
