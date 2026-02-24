import { Get, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/jwt_guard';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findOneById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
