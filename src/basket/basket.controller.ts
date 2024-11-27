import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { BasketService } from './basket.service';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get(':userId')
  findUserBasket(@Param('userId') userId: string) {
    return this.basketService.findUserBasket(+userId);
  }

  @Post()
  addToBasket(
    @Body() body: { userId: number; productId: number; quantity: number },
  ) {
    return this.basketService.addToBasket(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Delete(':id')
  removeFromBasket(@Param('id') id: string) {
    return this.basketService.removeFromBasket(+id);
  }

  @Delete('clear/:userId')
  clearBasket(@Param('userId') userId: string) {
    return this.basketService.clearBasket(+userId);
  }
}
