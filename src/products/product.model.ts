// src/products/product.model.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from '../categories/category.model';

export enum Quality {
  K14 = '14K',
  K18 = '18K',
  K22 = '22K',
}

@Table({ tableName: 'products' })
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DECIMAL(10, 2), // 10 digits, 2 decimal places
    allowNull: false,
  })
  weight: number; // gramm (float)

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comment: string; // Izoh

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  size: string; // O'lcham

  @Column({
    type: DataType.ENUM(...Object.values(Quality)),
    allowNull: true,
  })
  quality: Quality; // Sifat: 14K, 18K, 22K

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  images: string[];

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => Category)
  category: Category;
}