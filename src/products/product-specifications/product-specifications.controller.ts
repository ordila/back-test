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
import { ProductSpecificationsService } from './product-specifications.service';
import {
  CreateSpecificationCategoryDto,
  CreateSpecificationDto,
  UpdateSpecificationCategoryDto,
  UpdateSpecificationDto,
} from './dto/product-specifications.dto';

@Controller('products/:productId/specification-categories')
export class ProductSpecificationsController {
  constructor(
    private readonly productSpecificationsService: ProductSpecificationsService,
  ) {}

  @Get()
  async getAllCategoryWithSpecification(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.productSpecificationsService.getAllCategoriesWithSpecification(
      productId,
    );
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createSpecificationCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createSpecificationCategoryDto: CreateSpecificationCategoryDto,
  ) {
    return this.productSpecificationsService.createSpecificationCategory(
      productId,
      createSpecificationCategoryDto,
    );
  }

  @Patch(':categoryId')
  @UsePipes(new ValidationPipe())
  async updateSpecificationCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateSpecificationCategoryDto: UpdateSpecificationCategoryDto,
  ) {
    return this.productSpecificationsService.updateSpecificationCategory(
      categoryId,
      updateSpecificationCategoryDto,
    );
  }

  @Delete(':categoryId')
  async deleteSpecificationCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productSpecificationsService.deleteSpecificationCategory(
      categoryId,
    );
  }

  @Post(':categoryId/specification')
  @UsePipes(new ValidationPipe())
  async createSpecification(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() createSpecificationDto: CreateSpecificationDto,
  ) {
    return this.productSpecificationsService.createSpecification(
      categoryId,
      createSpecificationDto,
    );
  }

  @Patch(':categoryId/specification/:specificationId')
  @UsePipes(new ValidationPipe())
  async updateSpecification(
    @Param('specificationId', ParseIntPipe) specificationId: number,
    @Body() updateSpecificationDto: UpdateSpecificationDto,
  ) {
    return this.productSpecificationsService.updateSpecification(
      specificationId,
      updateSpecificationDto,
    );
  }

  @Delete(':categoryId/specification/:specificationId')
  async deleteSpecification(
    @Param('specificaionId', ParseIntPipe) specificaionId: number,
  ) {
    return this.productSpecificationsService.deleteSpecification(
      specificaionId,
    );
  }
}
