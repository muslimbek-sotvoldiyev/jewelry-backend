import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from '../products/product.model';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name_uz: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name_ru: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name_en: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name_tr: string;

  @HasMany(() => Product)
  products: Product[];
}
