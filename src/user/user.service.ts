import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from './entities/interface';
import { Twilio } from 'twilio';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

@Injectable()
export class UserService {
  private client: Twilio;
  private greg: 'VA9853423bb4b1bc63b6c96494e2184a78';
  constructor(@InjectModel('user') private userrep: Model<user>) {
    cloudinary.config({
      cloud_name: 'dmkicbywv',
      api_key: '415935595172263',
      api_secret: 'kouLe01iZU5vVK2f0OGUjPHVBvo',
    });
  }
  async findAll() {
    const users = await this.userrep.find();
    return users;
  }

  async findOne(id: string) {
    try {
      const user = await this.userrep.findById(id);
      if (!user) {
        return 'User not found';
      }
      return user;
    } catch (error) {
      return `Could not find user with id: ${id}`;
    }
  }
  async findemail(email: string) {
    try {
      const user = await this.userrep.findOne({ email });

      if (!user) {
        return 'User not found';
      }
      return await user;
    } catch (error) {
      return `Could not find user with email: ${email}`;
    }
  }

  async updateprofile(uploader: Express.Multer.File,id) {
    try {
      return new Promise(async (resolve, reject) => {
        const uploade = cloudinary.uploader.upload_stream(async (error, result) => {
          if (error) {
            reject(error);
          } else {
            const updatedUser = await this.userrep.findByIdAndUpdate(
              id,
              { avatar: result.secure_url },
              { new: true },
            );
            resolve(updatedUser.avatar);
          }
        });
        const readableStream = new Readable();
        readableStream.push(uploader.buffer);
        readableStream.push(null);
        readableStream.pipe(uploade);
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userrep.findByIdAndDelete(id);
      if (!user) {
        return 'User not found';
      }
      return user;
    } catch (error) {
      return `Could not delete user with id: ${id}`;
    }
  }
}
