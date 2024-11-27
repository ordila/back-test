import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body()
    createPaymentDto: {
      amount: number;
      currency: string;
      description: string;
    },
  ) {
    return this.paymentService.createPayment(createPaymentDto);
  }
}
