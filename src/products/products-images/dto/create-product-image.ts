import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;
}
