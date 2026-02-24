import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // Add comment
  @Post('tickets/:id/comments')
  addComment(
    @Param('id') ticketId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user?.sub || 1; // replace with JWT later
    return this.commentsService.create(ticketId, dto.message, userId);
  }

  // List comments
  @Get('tickets/:id/comments')
  listComments(@Param('id') ticketId: number) {
    return this.commentsService.findByTicket(ticketId);
  }

  // Edit comment
  @Patch('comments/:id')
  editComment(
    @Param('id') id: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user?.sub || 1;
    return this.commentsService.update(id, dto.message, userId);
  }

  // Delete comment
  @Delete('comments/:id')
  deleteComment(@Param('id') id: number, @Req() req: any) {
    const userId = req.user?.sub || 1;
    return this.commentsService.delete(id, userId);
  }
}
