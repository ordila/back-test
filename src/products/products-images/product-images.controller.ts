import {
  Controller,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateProductImageDto } from './dto/create-product-image';

import { ProductImagesService } from './product-images.service';

@Controller('products/:productId/images')
export class ProductImagesController {
  constructor(private readonly ProductImagesService: ProductImagesService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  async addImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createProductImageDto: CreateProductImageDto,
  ) {
    return this.ProductImagesService.addProductImage(
      productId,
      createProductImageDto.imageUrl,
      createProductImageDto.isDefault,
    );
  }

  @Delete(':imageId')
  async deleteImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.ProductImagesService.deleteProductImage(productId, imageId);
  }
}
