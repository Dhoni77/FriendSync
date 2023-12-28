import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('follow')
@ApiBearerAuth()
@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id')
  follow(@Req() { user }: { user: User }, @Param('id') id: string) {
    return this.followService.follow(id, user.id);
  }
}
