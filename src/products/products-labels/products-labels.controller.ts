import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductsLabelsService } from './products-labels.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Controller('labels')
export class ProductsLabelsController {
  constructor(private productsLabelsService: ProductsLabelsService) {}

  @Get('products-with-labels')
  async getHomeProductsWithLabels() {
    return this.productsLabelsService.getHomeProductsWithLabels();
  }

  @Get('products-with-labels/category/:categoryId')
  async getProductsWithLabelsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsLabelsService.getProductsWithLabelsByCategory(
      categoryId,
    );
  }

  @Post('')
  async createLabel(@Body() createLabelDto: CreateLabelDto) {
    return this.productsLabelsService.createLabel(createLabelDto);
  }

  @Post(':labelId/products/:productId/')
  async assignLabelToProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('labelId', ParseIntPipe) labelId: number,
  ) {
    return this.productsLabelsService.assignLabelToProduct(productId, labelId);
  }

  @Delete(':labelId/products/:productId')
  async removeLabelFromProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('labelId', ParseIntPipe) labelId: number,
  ) {
    return this.productsLabelsService.removeLabelFromProduct(
      productId,
      labelId,
    );
  }
}
