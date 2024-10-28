import { Module } from '@nestjs/common';
import { ProductsCategoriesController } from './products-categories.controller';
import { ProductsCategoriesService } from './products-categories.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ProductsCategoriesController],
  providers: [ProductsCategoriesService],
})
export class ProductsCategoriesModule {}
