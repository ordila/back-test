import { Module } from '@nestjs/common';
import { ProductsLabelsController } from './products-labels.controller';
import { ProductsLabelsService } from './products-labels.service';

@Module({
  controllers: [ProductsLabelsController],
  providers: [ProductsLabelsService],
})
export class ProductsLabelsModule {}
