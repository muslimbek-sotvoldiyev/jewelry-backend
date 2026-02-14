// src/products/products.service.ts
import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Category } from '../categories/category.model';

@Injectable({ scope: Scope.REQUEST }) // ✅ REQUEST scope
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @Inject(REQUEST) private request: Request, // ✅ Request inject
  ) {}

  // ✅ Request dan base URL ni olish
  private getBaseUrl(): string {
    const protocol = this.request.protocol; // http yoki https
    const host = this.request.get('host'); // localhost:3001
    return `${protocol}:/${host}/`; // API prefix qo'shildi
  }

  // ✅ Rasmlar URL ini to'liq qilish
  private formatImageUrls(images: string[]): string[] {
    if (!images || images.length === 0) return [];
    const baseUrl = this.getBaseUrl();
    return images.map(img => `${baseUrl}/uploads/${img}`);
  }

  // ✅ Product ni format qilish
  private formatProduct(product: any) {
    const productData = product.toJSON ? product.toJSON() : product;
    return {
      ...productData,
      images: this.formatImageUrls(productData.images || []),
    };
  }

  async create(createProductDto: CreateProductDto, images: string[]) {
    const product = await this.productModel.create({
      ...createProductDto,
      images,
    } as any);
    
    const fullProduct = await this.productModel.findByPk(product.id, {
      include: [{ model: Category }],
    });
    
    return this.formatProduct(fullProduct);
  }

  async findAll(categoryId?: number) {
    const where = categoryId ? { category_id: categoryId } : {};
    const products = await this.productModel.findAll({
      where,
      include: [{ 
        model: Category, 
        attributes: ['id', 'name_uz', 'name_ru', 'name_en', 'name_tr']
      }],
      order: [['createdAt', 'DESC']],
    });

    return products.map(product => this.formatProduct(product));
  }

  async findOne(id: number) {
    const product = await this.productModel.findByPk(id, {
      include: [{ model: Category }],
    });
    
    if (!product) {
      throw new NotFoundException(`Product ID ${id} topilmadi`);
    }
    
    return this.formatProduct(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto, images: string[]) {
    const product = await this.productModel.findByPk(id);
    
    if (!product) {
      throw new NotFoundException(`Product ID ${id} topilmadi`);
    }

    if (images && images.length > 0) {
      await product.update({ ...updateProductDto, images } as any);
    } else {
      await product.update(updateProductDto);
    }
    
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.productModel.findByPk(id);
    
    if (!product) {
      throw new NotFoundException(`Product ID ${id} topilmadi`);
    }
    
    await product.destroy();
    return { message: 'Product muvaffaqiyatli o\'chirildi' };
  }
}