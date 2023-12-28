import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Fetch user profile.' })
  getUserProfile(@Req() { user }: { user: User }) {
    return this.userService.getUserById(user.id);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Fetch all users with limit.' })
  getAllUsers(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('skip', ParseIntPipe) skip: number,
  ) {
    return this.userService.getAllUsers({ limit, skip });
  }

  @Get('/allUsers')
  @ApiOperation({ summary: 'Fetch all users.' })
  getUsers() {
    return this.userService.findMany();
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search all users with limit by user name.' })
  searchUsers(
    @Query('userName') userName: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('skip', ParseIntPipe) skip: number,
  ) {
    return this.userService.searchUsers({ userName, limit, skip });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch user by id.' })
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('/me/posts')
  getMyPosts(@Req() { user }: { user: User }) {
    return this.userService.getPostsByUser(user.id);
  }

  @Get('/me/bookmarks')
  getBookmarks(@Req() { user }: { user: User }) {
    return this.userService.getBookmarksByUser(user.id);
  }

  @Get('/posts/:id')
  getPosts(@Param('id') id: string) {
    return this.userService.getPostsByUser(id);
  }

  @Patch(':id')
  update(
    @Req() { user }: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(user.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
