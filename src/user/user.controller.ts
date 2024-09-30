import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  NotAcceptableException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendMailOptions } from 'nodemailer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Guard } from 'src/auth/dto/guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post('uploadimage')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(Guard) 
  uploder(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const max= req.user.user.user._id

    try {
      return this.userService.updateprofile(file,max);
    } catch (error) {
      throw new NotAcceptableException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
