// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    console.log('[create] Creating category:', createCategoryDto);
    
    const category = await this.categoryModel.create(createCategoryDto as any);
    
    return category;
  }

  async findAll() {
    return await this.categoryModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id);
    
    if (!category) {
      throw new NotFoundException(`Category ID ${id} topilmadi`);
    }
    
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    console.log('[update] Updating category:', id, updateCategoryDto);
    
    const category = await this.categoryModel.findByPk(id);
    
    if (!category) {
      throw new NotFoundException(`Category ID ${id} topilmadi`);
    }
    
    await category.update(updateCategoryDto);
    
    return category;
  }

  async remove(id: number) {
    console.log('[remove] Deleting category:', id);
    
    const category = await this.categoryModel.findByPk(id);
    
    if (!category) {
      throw new NotFoundException(`Category ID ${id} topilmadi`);
    }
    
    await category.destroy();
    
    return { message: 'Category muvaffaqiyatli o\'chirildi' };
  }
}