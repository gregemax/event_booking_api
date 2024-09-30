import { ThrottlerGuard } from '@nestjs/throttler';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    return Promise.resolve(req.user?.id || req.ip);
  }
}

@Injectable()
export class Guard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
@Injectable()
export class Guardrole extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.roles != 'admin') {
      throw new BadRequestException(`${user.name} you are not an admin`);
    }
    return user;
  }
}
