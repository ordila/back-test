import { Module } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { WishListController } from './wish-list.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [WishListController],
  providers: [WishListService],
})
export class WishListModule {}
