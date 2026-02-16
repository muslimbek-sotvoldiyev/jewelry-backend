// src/products/dto/product.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
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

  @Transform(({ value }) => parseFloat(value)) // String'dan float'ga
  @IsNotEmpty()
  weight: number; // gramm (float)

  @IsString()
  @IsOptional()
  comment?: string; // Izoh

  @IsString()
  @IsOptional()
  size?: string; // O'lcham

  @IsEnum(Quality)
  @IsOptional()
  quality?: Quality; // 14K, 18K, 22K

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  category_id: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  weight?: number; // gramm (float)

  @IsString()
  @IsOptional()
  comment?: string; // Izoh

  @IsString()
  @IsOptional()
  size?: string; // O'lcham

  @IsEnum(Quality)
  @IsOptional()
  quality?: Quality; // 14K, 18K, 22K

  @Transform(({ value }) => Number(value))
  @IsOptional()
  category_id?: number;

  @Transform(({ value }) => (value ? JSON.parse(value) : []))
  @IsOptional()
  removeImages?: string[];
}