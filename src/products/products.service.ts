import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Category } from '../categories/category.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable() // Scope.REQUEST olib tashlandi — provider muammolarini hal qiladi
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  private formatImageUrls(images: string[]): string[] {
    if (!images || images.length === 0) return [];
    return images.map((img) => {
      if (img.startsWith('http://') || img.startsWith('https://')) {
        // Strip absolute origin, keep only the path so clients proxy through their own host
        try {
          return new URL(img).pathname;
        } catch {
          return img;
        }
      }
      return `/uploads/${img}`;
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
      // URL bo'lsa, faqat fayl nomini olamiz
      const name = filename.includes('/') ? filename.split('/').pop()! : filename;
      const filePath = path.join(process.cwd(), 'uploads', name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[deleteImageFile] ✅ Deleted: ${name}`);
      }
    } catch (error) {
      console.error('[deleteImageFile] ❌ Error:', error);
    }
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
      include: [
        {
          model: Category,
          attributes: ['id', 'name_uz', 'name_ru', 'name_en', 'name_tr'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return products.map((product) => this.formatProduct(product));
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

  async update(id: number, updateProductDto: UpdateProductDto, newImages: string[]) {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product ID ${id} topilmadi`);
    }

    // removeImages ni alohida ajratib olamiz — modelga yozilmasin
    const { removeImages, ...productFields } = updateProductDto;

    let updatedImages = [...(product.images || [])];

    // O'chiriladigan rasmlarni o'chiramiz
    if (removeImages && removeImages.length > 0) {
      removeImages.forEach((imageName) => this.deleteImageFile(imageName));
      updatedImages = updatedImages.filter((img) => {
        const name = img.includes('/') ? img.split('/').pop()! : img;
        return !removeImages.includes(name);
      });
    }

    // Yangi rasmlarni qo'shamiz
    if (newImages && newImages.length > 0) {
      updatedImages = [...updatedImages, ...newImages];
    }

    // Maksimal 5 ta
    if (updatedImages.length > 5) {
      updatedImages = updatedImages.slice(0, 5);
    }

    await product.update({
      ...productFields,
      images: updatedImages,
    });

    const updatedProduct = await this.productModel.findByPk(id, {
      include: [{ model: Category }],
    });

    return this.formatProduct(updatedProduct);
  }

  async remove(id: number) {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product ID ${id} topilmadi`);
    }

    // Rasmlarni diskdan o'chiramiz
    if (product.images && product.images.length > 0) {
      product.images.forEach((imageName) => this.deleteImageFile(imageName));
    }

    await product.destroy();

    return { message: "Product muvaffaqiyatli o'chirildi" };
  }
}