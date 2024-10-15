import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';

@Injectable()
export class ProductsCategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        imageUrl: createCategoryDto.imageUrl,
      },
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: updateCategoryDto.name,
        imageUrl: updateCategoryDto.imageUrl,
      },
    });
  }
}
