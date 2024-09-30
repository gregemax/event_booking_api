import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './event/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomThrottlerGuard } from './auth/dto/guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://greg:ocheameh@cluster0.tl4al.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    AuthModule,
    AdminModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./.env`,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'times',
        ttl: 60000,
        limit: 10,
      },
    ]),
   
    BookingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
