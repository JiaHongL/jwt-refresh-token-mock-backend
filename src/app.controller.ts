import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('user/register')
  register() {
    this.usersService.addTestUser();
    return {
      success: true,
      message: 'user registered',
      data: null,
    };
  }

  @Post('user/delete')
  delete() {
    this.usersService.removeTestUser();
    return {
      success: true,
      message: 'user deleted',
      data: null,
    };
  }

  @UseGuards(AuthGuard('accessToken'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('accessToken'))
  @Get('categories')
  getCategories() {
    return {
      success: true,
      message: '',
      data: fakeCategories,
    };
  }

  @UseGuards(AuthGuard('accessToken'))
  @Get('posts')
  getPosts() {
    return {
      success: true,
      message: '',
      data: fakePosts.map((posts) => {
        const newPosts = {
          id: posts.id,
          title: posts.title,
          body: posts.body.substring(0, 80) + ' ...',
          tags: posts.tags,
          reactions: posts.reactions,
        };
        return newPosts;
      }),
    };
  }

  @UseGuards(AuthGuard('accessToken'))
  @Get('posts/:id')
  getPostDetail() {
    return {
      success: true,
      message: '',
      data: fakePosts,
    };
  }

  @UseGuards(AuthGuard('accessToken'))
  @Get('comments')
  getComments(@Query('postId') postId) {
    if (!postId) {
      throw new HttpException(
        'QueryParams 缺少 postId',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      success: true,
      message: '',
      data: fakeComments.filter((comment) => comment.postId == postId),
    };
  }

  @UseGuards(AuthGuard('refreshToken'))
  @Post('auth/refresh')
  async refreshTokens(@Request() req) {
    const user = await this.usersService.findOne(req.user.username);
    if (!user) {
      throw new HttpException('禁止訪問', HttpStatus.FORBIDDEN);
    } else {
      return this.authService.refreshToken(req.user);
    }
  }
}

const fakePosts = [
  {
    id: 1,
    postId: 11,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    userId: 9,
    tags: ['classA', 'classB'],
    reactions: 2,
  },
  {
    id: 2,
    postId: 22,
    title:
      'sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio',
    body: 'suscipit nam nisi quo aperiam aut\nasperiores eos fugit maiores voluptatibus quia\nvoluptatem quis ullam qui in alias quia est\nconsequatur magni mollitia accusamus ea nisi voluptate dicta',
    userId: 13,
    tags: ['classA', 'classC'],
    reactions: 2,
  },
  {
    id: 3,
    postId: 33,
    title: 'dolorum ut in voluptas mollitia et saepe quo animi',
    body: 'aut dicta possimus sint mollitia voluptas commodi quo doloremque\niste corrupti reiciendis voluptatem eius rerum\nsit cumque quod eligendi laborum minima\nperferendis recusandae assumenda consectetur porro architecto ipsum ipsam',
    userId: 32,
    tags: ['classA', 'classD'],
    reactions: 5,
  },
];

const fakeComments = [
  {
    id: 1,
    body: 'This is some awesome thinking!',
    postId: 11,
    user: {
      id: 63,
      username: 'eburras1q',
    },
  },
  {
    id: 2,
    body: 'What terrific math skills you"re showing!',
    postId: 11,
    user: {
      id: 71,
      username: 'omarsland1y',
    },
  },
  {
    id: 3,
    body: 'You are an amazing writer!',
    postId: 22,
    user: {
      id: 29,
      username: 'jissetts',
    },
  },
  {
    id: 4,
    body: 'Wow! You have improved so much!',
    postId: 22,
    user: {
      id: 19,
      username: 'bleveragei',
    },
  },
  {
    id: 5,
    body: 'Nice idea!',
    postId: 22,
    user: {
      id: 70,
      username: 'cmasurel1x',
    },
  },
  {
    id: 29,
    body: 'This is very perceptive!',
    postId: 33,
    user: {
      id: 70,
      username: 'cmasurel1x',
    },
  },
  {
    id: 30,
    body: 'What an accomplishment!',
    postId: 33,
    user: {
      id: 70,
      username: 'cmasurel1x',
    },
  },
];

const fakeCategories = ['classA', 'classB', 'classC', 'classD'];
