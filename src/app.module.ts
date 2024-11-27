import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products-item/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductImagesModule } from './products/products-images/product-images.module';
import { ProductSpecificationsModule } from './products/product-specifications/product-specifications.module';
import { ProductsCategoriesModule } from './products/products-categories/products-categories.module';
import { ProductsLabelsModule } from './products/products-labels/products-labels.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WishListModule } from './wish-list/wish-list.module';
import { ProductsReviewsModule } from './products/products-reviews/product-reviews.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { BasketModule } from './basket/basket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductsModule,
    ProductsCategoriesModule,
    ProductImagesModule,
    ProductSpecificationsModule,
    ProductsLabelsModule,
    AuthModule,
    WishListModule,
    ProductsReviewsModule,
    UserModule,
    PaymentModule,
    BasketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
