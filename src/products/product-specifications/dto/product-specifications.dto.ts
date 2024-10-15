import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecificationCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateSpecificationCategoryDto extends PartialType(
  CreateSpecificationCategoryDto,
) {}

export class CreateSpecificationDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateSpecificationDto extends PartialType(
  CreateSpecificationDto,
) {}
