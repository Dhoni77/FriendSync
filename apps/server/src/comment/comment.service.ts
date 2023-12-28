import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../api/services/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  create(createCommentDto: CreateCommentDto) {
    try {
      const comment = this.prismaService.comment.create({
        data: createCommentDto,
      });

      return comment;
    } catch (error) {
      Logger.error('Create comment failed: ', error);
    }
  }

  async update(id: string, updateComment: UpdateCommentDto) {
    try {
      await this.prismaService.comment.update({
        where: {
          id: updateComment.id,
        },
        data: updateComment,
      });
    } catch (error) {
      Logger.error('Update comment failed: ', error);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.comment.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      Logger.error('Delete comment failed: ', error);
    }
  }
}
