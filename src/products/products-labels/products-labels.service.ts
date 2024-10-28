import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class ProductsLabelsService {
  constructor(private prisma: PrismaService) {}
  async getHomeProductsWithLabels() {
    const labelsWithProducts = await this.prisma.label.findMany({
      include: {
        products: {
          include: {
            product: {
              include: {
                images: {
                  where: {
                    isDefault: true,
                  },
                  select: {
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return labelsWithProducts.map((label) => ({
      labelName: label.name,
      products: label.products.map((productLabel) => productLabel.product),
    }));
  }

  async getProductsWithLabelsByCategory(categoryId: number) {
    const labelsWithProducts = await this.prisma.label.findMany({
      include: {
        products: {
          where: {
            product: {
              categoryId: categoryId,
            },
          },
          include: {
            product: {
              include: {
                images: {
                  where: { isDefault: true },
                  select: { imageUrl: true },
                },
              },
            },
          },
        },
      },
    });

    return labelsWithProducts.map((label) => ({
      labelName: label.name,
      products: label.products.map((productLabel) => productLabel.product),
    }));
  }

  async createLabel(createLabelDto: CreateLabelDto) {
    return this.prisma.label.create({
      data: {
        name: createLabelDto.name,
        description: createLabelDto.description,
      },
    });
  }

  async assignLabelToProduct(productId: number, labelId: number) {
    return this.prisma.productLabel.create({
      data: {
        productId,
        labelId,
      },
    });
  }

  async removeLabelFromProduct(productId: number, labelId: number) {
    return this.prisma.productLabel.deleteMany({
      where: {
        productId,
        labelId,
      },
    });
  }
}
