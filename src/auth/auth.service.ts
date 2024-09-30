import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from 'src/user/entities/interface';
import { UserService } from 'src/user/user.service';
import * as bcryptjs from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userrep: Model<user>,

    private ConfigService: ConfigService,
    private JwtService: JwtService,
  ) {}

  async jwttoken(user) {
    const token = await this.JwtService.sign({ user });

    return { token, user };
  }

  async signup(createAuthDto: CreateAuthDto) {
    try {
      const newUser = await this.userrep.create(createAuthDto);
      return this.jwttoken(newUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(email, password) {
    try {
      const finduser = await this.userrep
        .findOne({ email })
        .select('+password');
      if (!finduser) {
        throw new NotFoundException('wronge email please try again');
      }

      const verify = await bcryptjs.compare(password, finduser.password);
      if (!verify) {
        throw new UnauthorizedException('wronge password');
      }
      const user = await this.userrep.findById(finduser.id);
      return this.jwttoken(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
