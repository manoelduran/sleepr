import { Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @MessagePattern('create_charge')
  // apply validation pipe to message microservice pattern
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
