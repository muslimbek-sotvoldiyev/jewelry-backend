// src/products/dto/product.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  category_id: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  weight?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    // Agar string bo'lsa, arrayga aylantirish
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  removeImages?: string[];
}