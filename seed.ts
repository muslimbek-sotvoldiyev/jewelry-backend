// import { Sequelize } from 'sequelize-typescript';
// import * as bcrypt from 'bcrypt';
// import * as dotenv from 'dotenv';
// import { Category } from './src/models/category.model';
// import { Product } from './src/models/product.model';

// dotenv.config();

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT) || 5432,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || 'postgres',
//   database: process.env.DB_DATABASE || 'ecommerce',
//   models: [Admin, Category, Product],
//   logging: false,
// });

// async function seed() {
//   try {
//     await sequelize.sync({ force: true }); // Bu barcha tablelarni qayta yaratadi
    
//     console.log('📦 Database synced');

//     // Admin yaratish
//     const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
//     const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(adminPassword, salt);

//     await Admin.create({
//       email: adminEmail,
//       password: hashedPassword,
//     });

//     console.log('✅ Admin yaratildi:');
//     console.log('   Email:', adminEmail);
//     console.log('   Password:', adminPassword);

//     // Demo kategoriyalar (ixtiyoriy)
//     const electronics = await Category.create({
//       name_uz: 'Elektronika',
//       name_ru: 'Электроника',
//       name_en: 'Electronics',
//       name_tr: 'Elektronik',
//     });

//     const clothing = await Category.create({
//       name_uz: 'Kiyimlar',
//       name_ru: 'Одежда',
//       name_en: 'Clothing',
//       name_tr: 'Giyim'
//     });

//     console.log('✅ Demo kategoriyalar yaratildi');

 

//     console.log('');
//     console.log('Endi serverni ishga tushiring: npm run start:dev');
    
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Xatolik:', error);
//     process.exit(1);
//   }
// }

// seed();
