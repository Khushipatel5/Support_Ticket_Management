import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  exports: [TypeOrmModule],
})
export class RolesModule {}
