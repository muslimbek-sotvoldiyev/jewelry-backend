import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';;
import { multerOptions } from '../config/multer.config';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
@UseGuards(AuthGuard)
@Post()
@UseInterceptors(FilesInterceptor('images', 5, multerOptions))
create(
  @Body() createProductDto: CreateProductDto,
  @UploadedFiles() files: Multer.File[],
) {
  const imagePaths = files?.map(file => file.filename) || [];
  return this.productsService.create(createProductDto, imagePaths);
}

  @Get()
  findAll(@Query('category_id') categoryId?: string) {
    return this.productsService.findAll(categoryId ? +categoryId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
 @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images?: Multer.File[],
  ) {
    const imagePaths = images?.map(file => file.filename) || [];
    return this.productsService.update(+id, updateProductDto, imagePaths);
  }
 @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

}
