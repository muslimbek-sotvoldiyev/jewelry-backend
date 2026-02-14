// src/products/dto/product.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) // ✅ String dan Number ga
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) // ✅ String dan Number ga
  @IsNumber()
  category_id: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value)) // ✅ String dan Number ga
  @IsNumber()
  weight?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value)) // ✅ String dan Number ga
  @IsNumber()
  category_id?: number;
}