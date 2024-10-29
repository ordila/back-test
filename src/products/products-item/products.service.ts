import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private buildFilters(query: GetAllProductsDto): any {
    const { category, priceMin, priceMax, searchTerm } = query;

    const filters: any = {};

    if (category) {
      filters.categoryId = category;
    }

    if (priceMin || priceMax) {
      filters.price = {
        gte: priceMin ? priceMin : undefined,
        lte: priceMax ? priceMax : undefined,
      };
    }

    if (searchTerm) {
      filters.name = {
        contains: searchTerm,
        mode: 'insensitive',
      };
    }

    return filters;
  }

  async getAll(query: GetAllProductsDto) {
    const { page = 1, limit = 10, sort = 'createdAt' } = query;

    const filters = this.buildFilters(query);

    return this.prisma.product.findMany({
      where: filters,
      include: { images: true },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: 'asc',
      },
    });
  }

  async findOneByID(id: number) {
    if (!id || id <= 0) {
      throw new Error('Invalid ID');
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variantCategories: {
          include: {
            variants: true,
          },
        },
        specificationCategories: {
          include: {
            specifications: true,
          },
        },
        reviews: true,
        label: {
          include: {
            label: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        discount: createProductDto.discount || 0,
        categoryId: createProductDto.categoryId,
      },
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
        discount: updateProductDto.discount,
        categoryId: updateProductDto.categoryId,
      },
    });
  }

  removeProduct(id: number) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async getDiscountedProductsForHome() {
    return this.prisma.product.findMany({
      where: {
        discount: {
          gte: 0,
        },
      },
      include: {
        images: {
          where: { isDefault: true },
        },
      },
      orderBy: {
        discount: 'desc',
      },
      take: 12,
    });
  }

  async getDiscountedProductsByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId: categoryId,
        discount: {
          gte: 0,
        },
      },
      orderBy: {
        discount: 'desc',
      },
      take: 12,
    });
  }
}
