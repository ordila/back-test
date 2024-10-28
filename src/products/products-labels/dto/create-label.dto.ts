import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
