import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../api/services/prisma/prisma.service';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const post = await this.prismaService.post.create({
        data: createPostDto,
      });

      return post;
    } catch (error) {
      Logger.error('Failed to create post: ', error);
    }
  }

  async findAll() {
    try {
      const posts = await this.prismaService.post.findMany({
        include: {
          Comment: true,
          Like: true,
          owner: true,
          Bookmark: true,
        },
      });
      return posts;
    } catch (error) {
      Logger.error('Failed to find all posts: ', error);
    }
  }

  getPostById(id: string) {
    try {
      const post = this.prismaService.post.findFirst({
        where: {
          id,
        },
        include: {
          owner: true,
          Like: true,
          Comment: true,
        },
      });
      return post;
    } catch (error) {
      Logger.error('Failed to getPostById: ', error);
    }
  }

  async getPostOfFollowings(userId: string) {
    try {
      const followings = await this.prismaService.user.findMany({
        where: { id: userId },
        select: {
          following: true,
        },
      });

      if (!followings) {
        return [];
      }

      const followingIds = followings.flatMap((following) =>
        following.following.map((f) => f.id),
      );

      const followPosts = await this.prismaService.post.findMany({
        where: {
          userId: {
            in: followingIds,
          },
        },
        include: {
          owner: true,
          Like: true,
          Comment: true,
        },
      });

      return followPosts;
    } catch (error) {
      Logger.error('Failed to getPostOfFollowings: ', error);
    }
  }

  async likeOrUnlikePost(postId: string, userId: string) {
    try {
      const isLikePresent = await this.prismaService.like.findFirst({
        where: {
          postId,
          userId,
        },
      });

      if (isLikePresent) {
        await this.prismaService.like.delete({
          where: {
            id: isLikePresent.id,
          },
        });
      } else {
        await this.prismaService.like.create({
          data: {
            postId,
            userId,
          },
        });
      }
    } catch (error) {
      Logger.error('Failed to like post: ', error);
    }
  }

  async addOrRemoveBookmark(userId: string, postId: string) {
    try {
      const isBookmarkPresent = await this.prismaService.bookmark.findFirst({
        where: {
          postId,
          userId,
        },
      });

      if (isBookmarkPresent) {
        await this.prismaService.bookmark.delete({
          where: {
            id: isBookmarkPresent.id,
          },
        });
      } else {
        await this.prismaService.bookmark.create({
          data: {
            postId,
            userId,
          },
        });
      }
    } catch (error) {
      Logger.error('Failed to add bookmark: ', error);
    }
  }

  async addComment(postId: string, comment: CreateCommentDto) {
    try {
      const isPostPresent = await this.prismaService.post.findFirst({
        where: {
          id: postId,
        },
      });

      if (isPostPresent) {
        await this.prismaService.comment.create({
          data: comment,
        });
      } else {
        throw new Error('Post was not found.');
      }
    } catch (error) {
      Logger.error('Failed to add comment: ', error);
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      await this.prismaService.post.update({
        where: { id },
        data: updatePostDto,
      });
    } catch (error) {
      Logger.error('Failed to update post: ', error);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.post.delete({
        where: { id: id },
      });
    } catch (error) {
      Logger.error('Failed to remove post: ', error);
    }
  }
}
