import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsCategoriesService } from './products-categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('products-categories')
export class ProductsCategoriesController {
  constructor(private productsCategoriesService: ProductsCategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.productsCategoriesService.getAllCategories();
  }
  @Get(':categoryId')
  async getCategoryById(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsCategoriesService.getCategoryByID(categoryId);
  }

  @UseGuards(AdminGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsCategoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsCategoriesService.deleteCategory(categoryId);
  }

  @UseGuards(AdminGuard)
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
