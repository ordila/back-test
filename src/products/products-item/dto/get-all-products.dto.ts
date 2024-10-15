import { Transform } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class GetAllProductsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  category?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  priceMin?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  priceMax?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
