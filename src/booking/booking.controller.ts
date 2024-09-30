import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Guard } from 'src/auth/dto/guard';

@Controller('booking')
@UseGuards(Guard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Post('')
  async bookevent(@Body() { eventid }, @Request() req): Promise<any> {
    let userid = req.user.user.user._id;
    return this.bookingService.bookevent(eventid, userid);
  }
  @Get('')
  async get(@Request() req): Promise<any> {
    let userid = req.user.user.user._id;
    return this.bookingService.getalluserevents(userid);
  }
  @Get('getbyadmin')
  async getbyadmin(
    @Request() req,
    @Query() query,
    @Body() username,
  ): Promise<any> {
    let userid = req.user.user.user._id;
    return this.bookingService.getallusereventsbyadmin(
      userid,
      query.skip,
      query.limit,
      username.name,
    );
  }
}
