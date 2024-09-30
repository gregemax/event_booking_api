import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { admininterface } from 'src/event/dto/interface';
import { user } from 'src/user/entities/interface';
import { bookinginterface } from './interface';
import { MailerService } from '@nestjs-modules/mailer';
import { email } from 'src/emails/email';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Admin_event') private admminrepo: Model<admininterface>,
    @InjectModel('booking') private booking: Model<bookinginterface>,
    @InjectModel('user') private userrep: Model<user>,
    private ConfigService:ConfigService ,
    private mailerService: MailerService,
  ) {}
  async bookevent(eventid, userid) {
    try {


      const event = await this.admminrepo.findOne({ _id: eventid });
      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (event.number_ticket_remaining <= 0) {
        throw new BadRequestException('no more tickets or seats available.');
      }
      const user = await this.userrep.findOne({ _id: userid });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const bookedevent = await this.booking.create({
        user,
        event,
      });

      bookedevent.populate(['user', 'event']);

      if (!bookedevent) {
        console.log('i will tryagain ');
      }

      await this.userrep.findByIdAndUpdate(
        user._id,
        {
          $push: { BookedeventID: bookedevent },
        },
        { new: true },
      );
      await this.admminrepo.findByIdAndUpdate(
        event._id,
        {
          $push: { Booked: bookedevent },
        },
        { new: true },
      );

      await user.save({ validateBeforeSave: false });
      event.attendees.push(user.name);
      event.number_ticket_remaining--;
      await event.save({ validateBeforeSave: false });
      await email(
        this.mailerService,
        user.email,
        `booked successfull for ${event.name}`,
        `${this.ConfigService.get("booked")}`
      );
      return bookedevent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getalluserevents(userid) {
    try {
      const bookedevent = await this.booking
        .find({
          user: userid,
        })
        .populate('event')
        .exec();
      if (!bookedevent) {
        throw new NotFoundException('User not found');
      }
      return bookedevent;
    } catch (error) {
      throw new BadRequestException(
        'Failed to get user events' + error.message,
      );
    }
  }
  async getallusereventsbyadmin(userid, skip, limit, name) {
    try {
      limit = limit || 10;
      const page = (skip - 1) * limit || 1;
      let search = {};
      if (name) {
        search = { user: { name: name } };
      }
      const bookedevent = await this.booking
        .find(search)
        .skip(page)
        .limit(+limit)
        .populate(['event', 'user'])
        .exec();
      if (!bookedevent) {
        throw new NotFoundException('User not found');
      }
      return {
        booked: bookedevent.length,
        bookedevent,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to get user events' + error.message,
      );
    }
  }
}
