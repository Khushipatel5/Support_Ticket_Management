import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Ticket } from '../tickets/entities/ticket.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Ticket, User])],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
