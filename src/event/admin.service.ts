import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { admininterface } from './dto/interface';
import { email } from 'src/emails/email';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { user } from 'src/user/entities/interface';

@Injectable()
export class AdminService {
  eventModel: any;
  constructor(
    @InjectModel('Admin_event') private admminrepo: Model<admininterface>,
    @InjectModel('user') private userrep: Model<user>,
    //@InjectModel('Admin_event') private user: Model<user>,
    private mailerService: MailerService,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    try {
      const newevent = await this.admminrepo.create(createAdminDto);
      return newevent;
    } catch (error) {
      throw new Error('Error creating admin');
    }
  }

  findAll(query) {
    try {
      let { name, location, date, minPrice, maxPrice, category, page, limit } =
        query;

      const filter: any = {};
      if (name) {
        filter.name = { $regex: name, $options: 'i' };
      }

      if (location) {
        filter.location = { $regex: location, $options: 'i' };
      }

      if (date) {
        filter.date = { $gte: date };
      }

      if (minPrice !== undefined) {
        filter.price = { ...filter.price, $gte: minPrice };
      }
      if (maxPrice !== undefined) {
        filter.price = { ...filter.price, $lte: maxPrice };
      }

      if (category) {
        filter.category = category;
      }

      if (!page && !limit) {
        page = 1;
        limit = 10;
      }
      const skip = (page - 1) * limit;
      return this.admminrepo
        .find(filter)
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.admminrepo.findOne();
    } catch (error) {}
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<any> {
    try {
      const updatedAdmin = await this.admminrepo
        .findByIdAndUpdate(id, updateAdminDto, { new: true })
        .populate('Booked');


      if (!updatedAdmin) {
        throw new BadRequestException('No changes were made');
      }

      const bookings = await Promise.all(
        updatedAdmin.Booked.map(async (booking) => {
          return booking;
        }),
      );


      bookings.forEach(async (booking) => {
        const greg=await this.userrep.findOne({
          _id:booking.user
        })  
        await email(
          this.mailerService,
          greg.email
     , 
        `Event updated successfully for ${updatedAdmin.name}`,
        `Details of the update...`
      );
        return greg
      });




      return { message: 'Update successful', bookings };
    } catch (error) {
      throw new BadRequestException('Failed to update admin: ' + error.message);
    }
  }

  async remove(id) {
    try {
      const update = await this.admminrepo.deleteOne(id);
      if (!update.deletedCount) {
        throw new NotFoundException('Admin not found');
      }
      return ' update successfull';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_11_30AM)
  async sendReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventsHappeningTomorrow = await this.eventModel
      .find({
        date: { $eq: tomorrow },
      })
      .populate('bookings');

    for (const event of eventsHappeningTomorrow) {
      for (const booking of event.bookings) {
        await email(
          booking.user.email,
          'Event Reminder',
          `Reminder: Your event ${event.title} is happening tomorrow.`,
          `<p>Reminder: Your event ${event.title} is happening tomorrow at ${event.date}.</p>`,
        );
      }
    }
  }
}
