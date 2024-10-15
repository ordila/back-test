import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products-item/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductImagesModule } from './products/products-images/product-images.module';
import { ProductSpecificationsModule } from './products/product-specifications/product-specifications.module';
import { ProductsCategoriesModule } from './products/products-categories/products-categories.module';
import { ProductsLabelsModule } from './products/products-labels/products-labels.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    ProductsCategoriesModule,
    ProductImagesModule,
    ProductSpecificationsModule,
    ProductsLabelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
