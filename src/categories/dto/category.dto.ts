import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name_uz: string;

  @IsNotEmpty()
  @IsString()
  name_ru: string;

  @IsNotEmpty()
  @IsString()
  name_en: string;

  @IsNotEmpty()
  @IsString()
  name_tr: string;

}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name_uz?: string;

  @IsOptional()
  @IsString()
  name_ru?: string;

  @IsOptional()
  @IsString()
  name_en?: string;

  @IsOptional()
  @IsString()
  name_tr?: string;

}
