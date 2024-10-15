import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
