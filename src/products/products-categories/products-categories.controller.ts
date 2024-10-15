import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsCategoriesService } from './products-categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';

@Controller('products-categories')
export class ProductsCategoriesController {
  constructor(private productsCategoriesService: ProductsCategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.productsCategoriesService.getAllCategories();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsCategoriesService.createCategory(createCategoryDto);
  }

  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsCategoriesService.deleteCategory(categoryId);
  }

  @Patch(':categoryId')
  @UsePipes(new ValidationPipe())
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.productsCategoriesService.updateCategory(
      categoryId,
      updateCategoryDto,
    );
  }
}
