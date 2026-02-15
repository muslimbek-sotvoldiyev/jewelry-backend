// src/products/products.service.ts
import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Category } from '../categories/category.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @Inject(REQUEST) private request: Request,
  ) {}

  private getBaseUrl(): string {
    const protocol = this.request.headers['x-forwarded-proto'] || this.request.protocol;
    const host = this.request.get('host');
    return `${protocol}://${host}`;
  }

  private formatImageUrls(images: string[]): string[] {
    if (!images || images.length === 0) return [];
    const baseUrl = this.getBaseUrl();
    return images.map(img => {
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      return `${baseUrl}/uploads/${img}`;
    });
  }

  private formatProduct(product: any) {
    const productData = product.toJSON ? product.toJSON() : product;
    return {
      ...productData,
      images: this.formatImageUrls(productData.images || []),
    };
  }

  private deleteImageFile(filename: string): void {
    try {
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('[deleteImageFile] ✅ Deleted:', filename);
      }
    } catch (error) {
      console.error('[deleteImageFile] ❌ Error:', error);
    }
  }

  async create(createProductDto: CreateProductDto, images: string[]) {
    console.log('[create] Creating product:', createProductDto);
    
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

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    newImages: string[],
  ) {
    console.log('[update] ========== UPDATE START ==========');
    
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product ID ${id} topilmadi`);
    }

    let updatedImages = [...(product.images || [])];

    // O'chiriladigan rasmlar
    if (updateProductDto.removeImages && updateProductDto.removeImages.length > 0) {
      updateProductDto.removeImages.forEach(imageName => {
        this.deleteImageFile(imageName);
      });
      
      updatedImages = updatedImages.filter(
        img => !updateProductDto.removeImages.includes(img),
      );
    }

    // Yangi rasmlar
    if (newImages && newImages.length > 0) {
      updatedImages = [...updatedImages, ...newImages];
    }

    // Maksimal 5 ta
    if (updatedImages.length > 5) {
      updatedImages = updatedImages.slice(0, 5);
    }

    await product.update({
      ...updateProductDto,
      images: updatedImages,
      removeImages: undefined,
    });

    const updatedProduct = await this.productModel.findByPk(id, {
      include: [{ model: Category }],
    });
    
    console.log('[update] ✅ Product updated');
    console.log('[update] ========== UPDATE END ==========');
    
    return this.formatProduct(updatedProduct);
  }

  async remove(id: number) {
    const product = await this.productModel.findByPk(id);
    
    if (!product) {
      throw new NotFoundException(`Product ID ${id} topilmadi`);
    }
    
    if (product.images && product.images.length > 0) {
      product.images.forEach(imageName => {
        this.deleteImageFile(imageName);
      });
    }
    
    await product.destroy();
    
    return { message: 'Product muvaffaqiyatli o\'chirildi' };
  }
}