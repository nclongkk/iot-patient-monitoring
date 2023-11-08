import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppRepository } from '../../../database/database.repository';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private appRepository: AppRepository) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      return result;
    }

    const user = await this.appRepository
      .use(User)
      .findOne({ where: { id: req.user.id }, select: ['id', 'name', 'email'] });

    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;
    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
