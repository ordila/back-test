import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddToBasketDto } from './dto/add-to-basket.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get(':userId')
  findUserBasket(@Param('userId') userId: string) {
    return this.basketService.findUserBasket(+userId);
  }

  @Post()
  addToBasket(@Body() addToBasketDto: AddToBasketDto) {
    return this.basketService.addToBasket(
      addToBasketDto.userId,
      addToBasketDto.productId,
      addToBasketDto.quantity,
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
