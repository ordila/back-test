import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  Patch,
  Body,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllProducts(@Query() query: GetAllProductsDto) {
    return this.productsService.getAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOneByID(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeProduct(id);
  }
}
