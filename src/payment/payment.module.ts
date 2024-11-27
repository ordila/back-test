import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentsController } from './payment.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentService],
})
export class PaymentModule {}
