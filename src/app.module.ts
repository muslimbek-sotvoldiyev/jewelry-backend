import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { Product } from "./products/product.model";
import { User } from "./users/users.model";
import { UsersModule } from "./users/users.module";
import { SharedModule } from "./common/shared.module";
import { GuardsModule } from "./common/guard/guards.module";
import { Category } from "./categories/category.model";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRoot({
      dialect: "postgres",
      uri: process.env.DATABASE_URL, // 🔥 asosiy o‘zgarish
      models: [User, Category, Product],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      // sync: { force: true },            // Har safar DBni tozalab yaratadi
    }),

    SharedModule,
    GuardsModule, // ✅ 1-o'rinda
    UsersModule, // ✅ 2-o'rinda (GuardsModule dan keyin)
    CategoriesModule, // ✅ 3-o'rinda
    ProductsModule, // ✅ 4-o'rinda
  ],
})
export class AppModule {}
