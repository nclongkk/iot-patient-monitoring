import { Injectable } from '@nestjs/common';
import { AppRepository } from '../../database/database.repository';
import { User } from '../../database/entities/user.entity';
import { bcryptPassword } from '../../shared/helper/helper';

@Injectable()
export class ScriptService {
  constructor(private appRepository: AppRepository) {}

  async generateUser() {
    const user: User = {
      name: 'admin',
      email: 'admin@gmail.com',
      password: '123123',
    };
    // user.password = await bcryptPassword(user.password);
    const userExist = await this.appRepository
      .use(User)
      .findOne({ where: { email: user.email } });
    if (!userExist) {
      await this.appRepository.use(User).save(user);
    }
  }
}
