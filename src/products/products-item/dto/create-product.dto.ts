import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @IsNumber()
  categoryId: number;
}
