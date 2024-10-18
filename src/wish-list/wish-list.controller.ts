import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('wish-list')
@UseGuards(AuthGuard)
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Get()
  async getWishList(@Req() req: Request) {
    const userId = req['user'].userId;

    return this.wishListService.getWishListForUser(userId);
  }

  @Post(':productId')
  async addToWishList(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req['user'].userId;
    return this.wishListService.addToWishList(userId, productId);
  }

  @Delete(':productId')
  async removeFromWishList(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req['user'].userId;
    return this.wishListService.removeFromWishList(userId, productId);
  }

  @Delete()
  async clearWishList(@Req() req: Request) {
    const userId = req['user'].userId;
    return this.wishListService.clearWishlist(userId);
  }
}
