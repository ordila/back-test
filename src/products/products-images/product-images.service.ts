import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  private async checkIfProductExists(productId: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    return !!product;
  }

  async addProductImage(
    productId: number,
    imageUrl: string,
    isDefault: boolean = false,
  ) {
    const productExists = await this.checkIfProductExists(productId);

    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    return this.prisma.productImage.create({
      data: {
        imageUrl,
        isDefault,
        productId,
      },
    });
  }

  async deleteProductImage(productId: number, imageId: number) {
    const productExists = await this.checkIfProductExists(productId);

    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    const result = await this.prisma.productImage.delete({
      where: {
        productId: productId,
        id: imageId,
      },
    });

    return result;
  }
}
