import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { user } from 'src/user/entities/user.entity';
import { admin_event } from 'src/event/entities/admin.entity';
import { booking } from './entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: user },
      { name: 'Admin_event', schema: admin_event },
      { name: 'booking', schema: booking },
    ]),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'milesmoralesmyguy@gmail.com',
          pass: 'iedhatvvdifrwjum',
        },
      },
      defaults: {
        from: '"Greg event booking api" <your_greg@example.com>',
      },
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
