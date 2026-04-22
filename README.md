# E-Commerce Admin Panel Backend

NestJS, Sequelize va PostgreSQL yordamida yaratilgan admin panel backend.

## 🚀 Xususiyatlar

- ✅ JWT autentifikatsiya (JwtService bilan)
- ✅ Access token (15 daqiqa) + Refresh token (7 kun)
- ✅ Bitta admin (seed bilan yaratiladi)
- ✅ Token refresh mexanizmi
- ✅ 4 tilda kategoriyalar (UZ, RU, EN, TR)
- ✅ 4 tilda mahsulotlar (UZ, RU, EN, TR)
- ✅ Category CRUD operatsiyalari
- ✅ Product CRUD operatsiyalari
- ✅ Image yuklash qo'llab-quvvatlash
- ✅ Stock boshqaruvi
- ✅ Featured mahsulotlar
- ✅ Active/Inactive toggle

## 📋 Talablar

- Node.js (v18 yoki yuqori)
- PostgreSQL (v14 yoki yuqori)
- npm yoki yarn

## ⚙️ O'rnatish

### 1. Dependencies o'rnating
```bash
npm install
```

### 2. PostgreSQL database yarating
```bash
# PostgreSQL ga kiring
psql -U postgres

# Database yarating
CREATE DATABASE ecommerce;

# Chiqing
\q
```

### 3. .env faylini yarating
```bash
cp .env.example .env
```

`.env` faylini tahrirlang:
```env
DATABASE_URL=your db url

JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRATION=7d

# For seeding
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
```

### 4. Database va Admin yaratish
```bash
npm run seed
```

Bu script:
- ✅ Database tablelarini yaratadi
- ✅ Admin userini yaratadi (email: admin@example.com, password: Admin123!)
- ✅ Demo kategoriya va mahsulotlarni qo'shadi

### 5. Serverni ishga tushiring
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Server `http://localhost:3001` da ishga tushadi.

## 📚 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1...",  // 15 daqiqa
  "refreshToken": "eyJhbGciOiJIUzI1..."  // 7 kun
}
```

#### Refresh Token (yangi access token olish)
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1..."  // yangi 15 daqiqa
}
```

### Categories

#### Barcha kategoriyalarni olish
```http
GET /api/categories
```

#### Bitta kategoriyani olish
```http
GET /api/categories/:id
```

#### Kategoriya yaratish (Auth kerak)
```http
POST /api/categories
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name_uz": "Elektronika",
  "description_uz": "Elektronika mahsulotlari",
  "name_ru": "Электроника",
  "description_ru": "Электронные товары",
  "name_en": "Electronics",
  "description_en": "Electronic products",
  "name_tr": "Elektronik",
  "description_tr": "Elektronik ürünler",
  "image": "https://example.com/image.jpg",
  "is_active": true,
  "sort_order": 1
}
```

#### Kategoriyani yangilash (Auth kerak)
```http
PATCH /api/categories/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name_uz": "Yangilangan nom",
  "is_active": false
}
```

#### Kategoriyani o'chirish (Auth kerak)
```http
DELETE /api/categories/:id
Authorization: Bearer {access_token}
```

#### Active/Inactive toggle (Auth kerak)
```http
PATCH /api/categories/:id/toggle-active
Authorization: Bearer {access_token}
```

### Products

#### Barcha mahsulotlarni olish
```http
GET /api/products

# Kategoriya bo'yicha filter
GET /api/products?category_id=1
```

#### Bitta mahsulotni olish
```http
GET /api/products/:id
```

#### Mahsulot yaratish (Auth kerak)
```http
POST /api/products
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name_uz": "iPhone 15 Pro",
  "description_uz": "Apple iPhone 15 Pro 256GB",
  "name_ru": "iPhone 15 Pro",
  "description_ru": "Apple iPhone 15 Pro 256ГБ",
  "name_en": "iPhone 15 Pro",
  "description_en": "Apple iPhone 15 Pro 256GB",
  "name_tr": "iPhone 15 Pro",
  "description_tr": "Apple iPhone 15 Pro 256GB",
  "price": 12999000,
  "discount_price": 11999000,
  "images": ["url1.jpg", "url2.jpg"],
  "stock": 50,
  "is_active": true,
  "is_featured": true,
  "category_id": 1
}
```

#### Mahsulotni yangilash (Auth kerak)
```http
PATCH /api/products/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "price": 11999000,
  "stock": 45
}
```

#### Mahsulotni o'chirish (Auth kerak)
```http
DELETE /api/products/:id
Authorization: Bearer {access_token}
```

#### Active/Inactive toggle (Auth kerak)
```http
PATCH /api/products/:id/toggle-active
Authorization: Bearer {access_token}
```

#### Featured toggle (Auth kerak)
```http
PATCH /api/products/:id/toggle-featured
Authorization: Bearer {access_token}
```

#### Stock yangilash (Auth kerak)
```http
PATCH /api/products/:id/stock
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "stock": 100
}
```

## 🗄️ Database Schema

### Admins
- id (primary key)
- email (unique)
- password (hashed)
- createdAt, updatedAt

### Categories
- id (primary key)
- name_uz, name_ru, name_en, name_tr
- description_uz, description_ru, description_en, description_tr
- image
- is_active
- sort_order
- createdAt, updatedAt

### Products
- id (primary key)
- name_uz, name_ru, name_en, name_tr
- description_uz, description_ru, description_en, description_tr
- price, discount_price
- images (array)
- stock
- is_active
- is_featured
- category_id (foreign key)
- createdAt, updatedAt

## 🔐 Security & Token Management

### Access Token
- ⏱️ 15 daqiqa amal qiladi
- 📤 Har bir API requestda yuboriladi
- 🔄 Muddati tugaganda refresh token bilan yangilanadi
- 🔑 JWT_ACCESS_SECRET bilan imzolanadi

### Refresh Token
- ⏱️ 7 kun amal qiladi
- 🔄 Yangi access token olish uchun ishlatiladi
- 🔑 JWT_REFRESH_SECRET bilan imzolanadi
- 💾 Database'da saqlanmaydi (stateless)

### Frontend Integration Misoli

```javascript
// 1. Login qilish
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  // Tokenlarni saqlash
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  
  return data;
};

// 2. Access token ni yangilash
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:3001/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  
  return data.accessToken;
};

// 3. API request qilish (auto-refresh bilan)
const apiRequest = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');
  
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Agar token muddati tugagan bo'lsa
  if (response.status === 401) {
    token = await refreshAccessToken();
    
    // Qayta urinish
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
  
  return response.json();
};

// 4. Mahsulot yaratish
const createProduct = async (productData) => {
  return await apiRequest('http://localhost:3001/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
};
```

## 🌍 Ko'p tillilik

Har bir category va product 4 ta tilda saqlanadi:
- `uz` - O'zbek tili
- `ru` - Rus tili
- `en` - Ingliz tili
- `tr` - Turk tili

Frontend'da til tanlashingiz mumkin va tegishli tildagi ma'lumotlarni ko'rsatasiz.

## 🐛 Debugging

```bash
# Logs ko'rish
npm run start:dev

# Database tekshirish
psql -U postgres -d ecommerce
\dt  # Barcha tablelarni ko'rish
SELECT * FROM admins;
SELECT * FROM categories;
SELECT * FROM products;
```

## 🔄 Database'ni qayta tiklash

Agar database'ni tozalash va qayta yaratish kerak bo'lsa:

```bash
npm run seed
```

Bu barcha ma'lumotlarni o'chiradi va qaytadan admin + demo data yaratadi.

## 📦 Production Deployment

1. `.env` faylini to'ldiring
2. Database yarating va seed ishga tushiring
3. Build qiling: `npm run build`
4. Serverni ishga tushiring: `npm run start:prod`

## 🤝 Yordam

Agar savollar bo'lsa, bog'laning.
