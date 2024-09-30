import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { admin_event } from './entities/admin.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { user } from 'src/user/entities/user.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'Admin_event', schema: admin_event },
      { name: 'user', schema: user },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
