import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { user } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './dto/jwtstratage';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: user }]),
    UserModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
      
        
        secret: configService.get('jwtkey'),
      }),
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
