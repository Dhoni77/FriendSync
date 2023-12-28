import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../api/services/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
      include: {
        posts: true,
        bookmarks: true,
        followers: true,
        following: true,
      },
    });

    return user;
  }

  async getAllUsers({ skip, limit }: { skip: number; limit: number }) {
    try {
      const users = await this.prismaService.user.findMany({
        skip: skip,
        take: limit,
      });

      return users;
    } catch (error) {
      Logger.error(
        `Failed to fetch users with limit: ${limit} and skip: ${skip}`,
        error,
      );
    }
  }

  async searchUsers({
    userName,
    skip,
    limit,
  }: {
    userName: string;
    skip: number;
    limit: number;
  }) {
    try {
      const users = await this.prismaService.user.findMany({
        skip: skip,
        take: limit,
        where: {
          userName: {
            contains: userName,
          },
        },
      });

      return users;
    } catch (error) {
      Logger.error(
        `Failed to fetch users with limit: ${limit} and userName: ${userName}`,
        error,
      );
    }
  }

  async findMany() {
    try {
      const users = await this.prismaService.user.findMany();
      return users;
    } catch (error) {
      Logger.error('Failed to fetch users', error);
    }
  }

  async getPostsByUser(id: string) {
    try {
      const posts = await this.prismaService.user.findFirst({
        where: { id },
        select: {
          posts: true,
          likes: true,
          comments: true,
        },
      });
      return posts;
    } catch (error) {
      Logger.error('Failed to get posts by user: ', error);
    }
  }

  async getBookmarksByUser(id: string) {
    try {
      const bookmarks = await this.prismaService.user.findFirst({
        where: { id },
        select: {
          bookmarks: true,
        },
      });

      return bookmarks;
    } catch (error) {
      Logger.error('Failed to fetch bookmarks by user', error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({
        data: updateUserDto,
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      Logger.error('Update user failed: ', error);
    }
  }

  async deleteUser(id: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      Logger.error('Delete user failed: ', error);
    }
  }
}
