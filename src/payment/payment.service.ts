import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private publicKey: string;
  private privateKey: string;

  constructor(private configService: ConfigService) {
    this.publicKey = this.configService.get<string>('YOUR_PUBLIC_KEY_PAYPAL');
    this.privateKey = this.configService.get<string>('YOUR_PRIVATE_KEY_PAYPAL');
  }

  createPayment(data: {
    amount: number;
    currency: string;
    description: string;
  }) {
    const paymentData = {
      public_key: this.publicKey,
      version: '3',
      action: 'pay',
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      order_id: Math.floor(1e10 * Math.random()).toString(),
    };

    const dataBase64 = Buffer.from(JSON.stringify(paymentData)).toString(
      'base64',
    );
    const signature = crypto
      .createHash('sha1')
      .update(this.privateKey + dataBase64 + this.privateKey)
      .digest('base64');

    return { data: dataBase64, signature };
  }
}
