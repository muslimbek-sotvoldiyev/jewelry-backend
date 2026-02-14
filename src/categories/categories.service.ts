// src/categories/categories.service.ts
import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './category.model';
import { Product } from '../products/product.model';

@Injectable({ scope: Scope.REQUEST }) // ✅ REQUEST scope
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @Inject(REQUEST) private request: Request, // ✅ Request inject
  ) {}

  // ✅ Request dan base URL ni olish
  private getBaseUrl(): string {
    const protocol = this.request.protocol;
    const host = this.request.get('host');
    return `${protocol}:/${host}/`; // API prefix qo'shildi
  }

  // ✅ Rasmlar URL ini to'liq qilish
  private formatImageUrls(images: string[]): string[] {
    if (!images || images.length === 0) return [];
    const baseUrl = this.getBaseUrl();
    return images.map(img => `${baseUrl}/uploads/${img}`);
  }

  // ✅ Category va uning mahsulotlarini format qilish
  private formatCategory(category: any) {
    const categoryData = category.toJSON ? category.toJSON() : category;
    
    // Agar mahsulotlar bo'lsa, ularni ham format qilish
    if (categoryData.products && Array.isArray(categoryData.products)) {
      categoryData.products = categoryData.products.map((product: any) => ({
        ...product,
        images: this.formatImageUrls(product.images || []),
      }));
    }
    
    return categoryData;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto as any);
  }

  async findAll() {
    const categories = await this.categoryModel.findAll({
      order: [['createdAt', 'DESC']],
    });
    
    return categories.map(cat => this.formatCategory(cat));
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id, {
      include: [{ 
        model: Product,
        attributes: ['id', 'name', 'weight', 'images', 'category_id', 'createdAt', 'updatedAt']
      }],
    });
    
    if (!category) {
      throw new NotFoundException(`Category ID ${id} topilmadi`);
    }
    
    return this.formatCategory(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByPk(id);
    
    if (!category) {
      throw new NotFoundException(`Category ID ${id} topilmadi`);
    }
    
    await category.update(updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.categoryModel.findByPk(id);
    
    if (!category) {
      throw new NotFoundException(`Category ID ${id} topilmadi`);
    }
    
    await category.destroy();
    return { message: 'Category muvaffaqiyatli o\'chirildi' };
  }
}