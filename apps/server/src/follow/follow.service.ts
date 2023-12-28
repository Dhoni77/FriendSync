import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../api/services/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prismaService: PrismaService) {}

  async follow(id: string, userId: string) {
    try {
      const userToFollow = await this.prismaService.user.findFirst({
        where: { id },
        include: {
          followers: true,
        },
      });

      if (userToFollow && userToFollow.id === userId) {
        throw new Error("You can't follow yourself");
      }

      if (!userToFollow) {
        throw new Error('User Not Found');
      }

      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
        include: {
          following: true,
        },
      });

      const isAlreadyFollowing = user?.following.map((f) => f.id).includes(id);

      const propToRemove = (
        prop: string,
        obj: Record<string, any>,
      ): Record<string, any> => {
        const { [prop]: omittedProp, ...rest } = obj;
        return rest;
      };

      if (isAlreadyFollowing) {
        // unfollow user
        if (user?.following) {
          user.following = user?.following.filter((f) => f.id !== id);
        }
        // remove from followers
        userToFollow.followers = userToFollow?.followers.filter(
          (f) => f.id !== id,
        );
      } else {
        const followers = propToRemove('following', user!);
        userToFollow.followers.push(followers as any);
        user?.following.push(userToFollow);
      }
      // update followers
      await this.prismaService.user.update({
        where: { id },
        data: {
          followers: {
            set: userToFollow.followers,
          },
        },
      });
      // update following
      await this.prismaService.user.update({
        where: { id: userId },
        data: {
          following: {
            set: user?.following,
          },
        },
      });
    } catch (error) {
      Logger.error('Follow failed: ', error);
    }
  }
}
