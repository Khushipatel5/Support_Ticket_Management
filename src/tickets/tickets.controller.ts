import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateStatusDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  createTicket(@Body() dto: CreateTicketDto, @Req() req: any) {
    // user id from JWT
    const userId = req.user?.sub || 1; // temporary fallback
    return this.ticketsService.create(dto, userId);
  }

  @Get()
  getAllTickets() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  getTicket(@Param('id') id: number) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id/assign/:userId')
  assignTicket(@Param('id') id: number, @Param('userId') userId: number) {
    return this.ticketsService.assign(id, userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body() dto: UpdateStatusDto) {
    return this.ticketsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  deleteTicket(@Param('id') id: number) {
    return this.ticketsService.delete(id);
  }
}
