import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProductsReviewsService } from './product-reviews.service';
import { CreateProductReviewDto } from './dto/create-reviews.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('reviews')
export class ProductsReviewsController {
  constructor(private productsReviewsService: ProductsReviewsService) {}

  @Get(':productId')
  async getReviews(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsReviewsService.getProductsReviews(productId);
  }

  @Post(':productId')
  @UseGuards(AuthGuard)
  async createReview(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateProductReviewDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].userId;

    return this.productsReviewsService.createProductReview(
      parseInt(productId, 10),
      createReviewDto,
      userId,
    );
  }
}
