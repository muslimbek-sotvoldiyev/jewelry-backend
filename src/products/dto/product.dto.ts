import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export enum Quality {
  K14 = '14K',
  K18 = '18K',
  K22 = '22K',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsEnum(Quality)
  @IsOptional()
  quality?: Quality;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }) => (value !== undefined ? parseFloat(value) : undefined))
  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsEnum(Quality)
  @IsOptional()
  quality?: Quality;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })
  @IsOptional()
  removeImages?: string[];
}