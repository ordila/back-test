import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateSpecificationCategoryDto,
  CreateSpecificationDto,
  UpdateSpecificationCategoryDto,
  UpdateSpecificationDto,
} from './dto/product-specifications.dto';

@Injectable()
export class ProductSpecificationsService {
  constructor(private prisma: PrismaService) {}

  async getAllCategoriesWithSpecification(productId: number) {
    const categories = await this.prisma.productSpecificationsCategory.findMany(
      {
        where: { productId },
        include: { specifications: true },
      },
    );

    return {
      productId,
      specifications: categories.map((category) => ({
        category: category.name,
        specs: category.specifications.map((spec) => ({
          key: spec.key,
          value: spec.value,
        })),
      })),
    };
  }

  async createSpecificationCategory(
    productId: number,
    createSpecificationCategoryDto: CreateSpecificationCategoryDto,
  ) {
    return this.prisma.productSpecificationsCategory.create({
      data: {
        productId,
        name: createSpecificationCategoryDto.name,
        description: createSpecificationCategoryDto.description,
      },
    });
  }

  async updateSpecificationCategory(
    categoryId,
    updateSpecificationCategoryDto: UpdateSpecificationCategoryDto,
  ) {
    return this.prisma.productSpecificationsCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        name: updateSpecificationCategoryDto.name,
        description: updateSpecificationCategoryDto.description,
      },
    });
  }

  async deleteSpecificationCategory(categoryId: number) {
    return this.prisma.productSpecificationsCategory.delete({
      where: {
        id: categoryId,
      },
    });
  }

  async createSpecification(
    categoryId,
    createCategoryDto: CreateSpecificationDto,
  ) {
    return this.prisma.productSpecification.create({
      data: {
        specificationCategoriesID: categoryId,
        key: createCategoryDto.key,
        value: createCategoryDto.value,
      },
    });
  }

  async updateSpecification(
    specificationId: number,
    updateSpecification: UpdateSpecificationDto,
  ) {
    return this.prisma.productSpecification.update({
      where: {
        id: specificationId,
      },
      data: {
        key: updateSpecification.key,
        value: updateSpecification.value,
      },
    });
  }

  async deleteSpecification(specificationId: number) {
    return this.prisma.productSpecification.delete({
      where: { id: specificationId },
    });
  }
}
