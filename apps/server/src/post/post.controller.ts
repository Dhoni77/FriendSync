import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';

@ApiTags('posts')
@Controller('post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Post('like/:id')
  like(@Param('id') postId: string, @Req() { user }: { user: User }) {
    return this.postService.likeOrUnlikePost(postId, user.id);
  }

  @Post('bookmark/:id')
  bookmark(@Param('id') postId: string, @Req() { user }: { user: User }) {
    return this.postService.addOrRemoveBookmark(user.id, postId);
  }

  @Post('comment/:id')
  comment(@Param('id') id: string, @Body() comment: CreateCommentDto) {
    return this.postService.addComment(id, comment);
  }

  @Get('all')
  findAll() {
    return this.postService.findAll();
  }

  @Get('following')
  findAllFollowings(@Req() { user }: { user: User }) {
    return this.postService.getPostOfFollowings(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch post.' })
  findOne(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
