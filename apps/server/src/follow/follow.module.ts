import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { PrismaModule } from '../api/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
