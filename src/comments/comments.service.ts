import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';
import { User } from 'src/users/users.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(ticketId: number, message: string, userId: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    const comment = this.commentRepo.create({
      message,
      ticket,
      author: user,
    });

    return this.commentRepo.save(comment);
  }

  async findByTicket(ticketId: number) {
    return this.commentRepo.find({
      where: { ticket: { id: ticketId } },
      relations: ['author'],
      order: { created_at: 'ASC' },
    });
  }

  async update(id: number, message: string, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'author.role'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (
      comment.author.id !== userId &&
      comment.author.role.name !== 'MANAGER'
    ) {
      throw new ForbiddenException('Not allowed');
    }

    comment.message = message;
    return this.commentRepo.save(comment);
  }

  async delete(id: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'author.role'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (
      comment.author.id !== userId &&
      comment.author.role.name !== 'MANAGER'
    ) {
      throw new ForbiddenException('Not allowed');
    }

    await this.commentRepo.delete(id);
    return { message: 'Comment deleted successfully' };
  }
}
