import { Module } from '@nestjs/common';
import { ProductsReviewsService } from './product-reviews.service';
import { ProductsReviewsController } from './product-reviews.controller';
import { JwtService } from 'src/common/services/jwt.service';

@Module({
  controllers: [ProductsReviewsController],
  providers: [ProductsReviewsService, JwtService],
})
export class ProductsReviewsModule {}
