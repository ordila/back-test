import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductReviewDto } from './dto/create-reviews.dto';

@Injectable()
export class ProductsReviewsService {
  constructor(private prisma: PrismaService) {}

  async getProductsReviews(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          email: review.user.email,
          name: review.user.name,
          middleName: review.user.middleName,
          lastName: review.user.lastName,
        },
      })),
    };
  }

  async createProductReview(
    productId: number,
    createReviewDto: CreateProductReviewDto,
    userId: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const review = await this.prisma.review.create({
      data: {
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        productId,
        userId,
      },
    });

    return review;
  }
}
