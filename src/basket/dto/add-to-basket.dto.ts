import { IsInt, Min } from 'class-validator';

export class AddToBasketDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
