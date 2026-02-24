import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private repo: Repository<Ticket>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: any, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    const ticket = this.repo.create({
      ...dto,
      created_by: user,
    });

    return this.repo.save(ticket);
  }

  findAll() {
    return this.repo.find({
      relations: ['created_by', 'assigned_to'],
    });
  }

  async assign(ticketId: number, userId: number) {
    const ticket = await this.repo.findOne({
      where: { id: ticketId },
    });

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    ticket.assigned_to = user;
    ticket.status = TicketStatus.IN_PROGRESS;

    return this.repo.save(ticket);
  }

  async updateStatus(id: number, status: TicketStatus) {
    const ticket = await this.repo.findOne({ where: { id } });
    ticket.status = status;
    return this.repo.save(ticket);
  }
}
