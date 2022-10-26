import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpException,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

import { ResultOfErrorDto } from './_models/result/result-of-error.dto';
import { ResultOfStringDto } from './_models/result/result-of-string.dto';

import { LoginBodyDto } from './_models/body/login-body.dto';

import { RefreshBodyDto } from './_models/body/refresh-body.dto';
import { ResultOfLoginSuccessfullyDto } from './_models/result/result-of-login-successfully.dto';
import { ResultOfRefreshedSuccessfullyDto } from './_models/result/result-of-refreshed-successfully.dto';

import { ResultOfProfileDto } from './_models/result/result-of-profile.dto';
import { ResultOfPostListDto } from './_models/result/result-of-post-list.dto';
import { ResultOfPostDetailDto } from './_models/result/result-of-post-detail.dto';
import { ResultOfCategoryListDto } from './_models/result/result-of-category-list.dto';
import { ResultOfCommentListDetailDto } from './_models/result/result-of-comment-list.dto';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiTags('auth')
  @ApiOperation({ summary: '登入帳號 (獲取 accessToken 與 refreshToken)' })
  @ApiResponse({
    status: 201,
    description: '登入成功',
    type: ResultOfLoginSuccessfullyDto,
  })
  @ApiResponse({
    status: 401,
    description: '登入失敗',
    type: ResultOfErrorDto,
  })
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Body() loginBodyDto: LoginBodyDto) {
    return this.authService.login(loginBodyDto);
  }

  @ApiTags('auth')
  @ApiOperation({
    summary: 'refresh Token (獲取新的 accessToken 與 refreshToken)',
  })
  @ApiBody({
    type: RefreshBodyDto,
  })
  @ApiResponse({
    status: 201,
    description: '刷新成功',
    type: ResultOfRefreshedSuccessfullyDto,
  })
  @ApiResponse({
    status: 401,
    description: '刷新失敗',
    type: ResultOfErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: '禁止使用 (測試帳號已被刪除)',
    type: ResultOfErrorDto,
  })
  @UseGuards(AuthGuard('refreshToken'))
  @Post('auth/refreshToken')
  async refreshTokens(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @ApiTags('user')
  @ApiOperation({ summary: '註冊帳號 (將測試帳號加回)' })
  @ApiResponse({
    status: 201,
    description: '註冊帳號成功 (將測試帳號加回)',
    type: ResultOfStringDto,
  })
  @Post('user/register')
  register(): ResultOfStringDto {
    this.usersService.addTestUser();
    return new ResultOfStringDto({
      success: true,
      message: '註冊成功',
      data: null,
    });
  }

  @ApiTags('user')
  @ApiOperation({ summary: '刪除帳號 (將測試帳號移除)' })
  @ApiResponse({
    status: 201,
    description: '刪除帳號成功 (將測試帳號移除)',
    type: ResultOfStringDto,
  })
  @Post('user/delete')
  delete(): ResultOfStringDto {
    this.usersService.removeTestUser();
    return new ResultOfStringDto({
      success: true,
      message: '刪除成功',
      data: null,
    });
  }

  @ApiTags('user')
  @ApiOperation({ summary: '獲取個人資料' })
  @ApiResponse({
    status: 200,
    description: '獲取資料成功',
    type: ResultOfProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: '獲取資料失敗',
    type: ResultOfErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: '禁止使用 (測試帳號已被刪除)',
    type: ResultOfErrorDto,
  })
  @UseGuards(AuthGuard('accessToken'))
  @Get('user/profile')
  getProfile(@Request() req) {
    return new ResultOfProfileDto({
      success: true,
      message: '',
      data: {
        id: 999,
        ...req.user,
        avatar: 'https://loremflickr.com/80/80/man?lock=56',
      },
    });
  }

  @ApiTags('posts')
  @ApiOperation({ summary: '獲取文章列表' })
  @ApiResponse({
    status: 200,
    description: '獲取資料成功',
    type: ResultOfPostListDto,
  })
  @ApiResponse({
    status: 401,
    description: '獲取資料失敗',
    type: ResultOfErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: '禁止使用 (測試帳號已被刪除)',
    type: ResultOfErrorDto,
  })
  @UseGuards(AuthGuard('accessToken'))
  @Get('posts')
  getPosts() {
    return new ResultOfPostListDto({
      success: true,
      message: '',
      data: fakePosts.map((posts) => {
        const newPosts = {
          id: posts.id,
          title: posts.title,
          body: posts.body.substring(0, 80) + ' ...',
          cover: posts.cover,
          tags: posts.tags,
          user: posts.user,
        };
        return newPosts;
      }),
    });
  }

  @ApiTags('posts')
  @ApiOperation({ summary: '獲取文章詳細資料' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: '獲取資料成功',
    type: ResultOfPostDetailDto,
  })
  @ApiResponse({
    status: 401,
    description: '獲取資料失敗',
    type: ResultOfErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: '禁止使用 (測試帳號已被刪除)',
    type: ResultOfErrorDto,
  })
  @UseGuards(AuthGuard('accessToken'))
  @Get('posts/:id')
  getPostDetail(@Param('id') id) {
    return new ResultOfPostDetailDto({
      success: true,
      message: '',
      data: fakePosts.find((posts) => posts.id == id) || null,
    });
  }

  @ApiTags('other')
  @ApiOperation({ summary: '獲取分類' })
  @ApiResponse({
    status: 200,
    description: '獲取資料成功',
    type: ResultOfCategoryListDto,
  })
  @ApiResponse({
    status: 401,
    description: '獲取資料失敗',
    type: ResultOfErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: '禁止使用 (測試帳號已被刪除)',
    type: ResultOfErrorDto,
  })
  @UseGuards(AuthGuard('accessToken'))
  @Get('categories')
  getCategories() {
    return new ResultOfCategoryListDto({
      success: true,
      message: '',
      data: fakeCategories,
    });
  }

  @ApiTags('other')
  @ApiOperation({ summary: '獲取文章的留言' })
  @ApiResponse({
    status: 200,
    description: '獲取資料成功',
    type: ResultOfCommentListDetailDto,
  })
  @ApiResponse({
    status: 401,
    description: '獲取資料失敗',
    type: ResultOfErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: '禁止使用 (測試帳號已被刪除)',
    type: ResultOfErrorDto,
  })
  @ApiQuery({ name: 'postId' })
  @UseGuards(AuthGuard('accessToken'))
  @Get('comments')
  getComments(@Query('postId') postId) {
    console.log('postId', postId);
    if (!postId) {
      throw new HttpException(
        'QueryParams 缺少 postId',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      success: true,
      message: '',
      data: fakeComments.filter((comment) => comment.postId == postId) || [],
    };
  }
}

const fakePostsBody = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec hendrerit pretium dolor, vel pulvinar eros facilisis non. Mauris lorem orci, porta fringilla pulvinar eget, hendrerit eget eros. Aenean tempus, metus et euismod blandit, nulla leo tincidunt ipsum, nec euismod metus magna sed erat. Duis quis mauris mollis, hendrerit libero vel, venenatis metus. Nulla varius lectus quis lorem dignissim, eu ornare nisl ultrices. Nulla et nibh vel erat convallis imperdiet non at odio. Integer et urna at nunc dignissim lobortis.\n  
Cras ornare, nibh nec blandit pellentesque, magna arcu convallis mauris, eu ultricies ante nulla id risus. Curabitur tempor ante magna, eget efficitur odio iaculis vitae. Phasellus quam risus, blandit eget dapibus eget, molestie non tellus. Donec quis metus blandit, iaculis nisi sed, facilisis augue. Duis vel ante dolor. In lorem mauris, interdum ac faucibus vitae, malesuada id turpis. Curabitur non tempor massa, eget porta risus. Integer interdum mi consectetur leo egestas, non vestibulum metus mattis. Morbi pellentesque venenatis tellus ut tincidunt. Aenean elementum, sem ac commodo consequat, neque lorem aliquet ligula, at placerat erat neque in elit.\n  
Etiam in fermentum lectus, eget laoreet urna. Nullam hendrerit rhoncus interdum. Suspendisse congue risus in velit imperdiet accumsan. Quisque in rutrum augue. Ut interdum convallis enim et mattis. Morbi a aliquet massa. Suspendisse at sollicitudin ligula. In a sem in velit laoreet elementum ut at enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum sit amet tellus ut tincidunt. Aliquam sodales magna non lectus molestie, venenatis fermentum tortor sollicitudin. Cras ornare vehicula mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque et ligula at ipsum egestas fringilla ut sed mauris. Integer a dapibus arcu, ac vehicula magna.\n  
Pellentesque mattis ante et ligula ultricies venenatis. Suspendisse cursus mattis elementum. Nam lobortis ac turpis ut hendrerit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vestibulum sem erat, at iaculis urna tempor ac. Etiam et diam ut elit vulputate blandit. Duis venenatis posuere euismod. Suspendisse eu ultrices lacus. Pellentesque a finibus massa. Phasellus lacinia nisi ut dictum luctus. Quisque at pellentesque eros.\n  
Donec non odio pulvinar, pellentesque lacus in, tristique tortor. Praesent lacinia ultrices risus, non convallis felis. Mauris egestas, massa vel aliquam luctus, augue sem vulputate mauris, viverra consequat nulla magna at lorem. Fusce non purus ante. Phasellus a quam suscipit, aliquam lacus in, pellentesque arcu. Suspendisse pretium metus egestas, dignissim nisi a, pulvinar purus. Donec at gravida libero, quis posuere massa. Pellentesque aliquet egestas tortor.`;

const fakePosts = [
  {
    id: 1,
    postId: 11,
    title: 'sunt aut facere repellat provident occaecati excepturi',
    body:
      'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto' +
      fakePostsBody,
    tags: ['ClassA', 'ClassB'],
    cover: 'https://loremflickr.com/536/354/dog?lock=4',
    user: {
      id: 71,
      username: 'omarsland1y',
      avatar: 'https://loremflickr.com/80/80/girl?lock=18',
    },
  },
  {
    id: 2,
    postId: 22,
    title:
      'sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio',
    body:
      'suscipit nam nisi quo aperiam aut asperiores eos fugit maiores voluptatibus quia voluptatem quis ullam qui in alias quia est consequatur magni mollitia accusamus ea nisi voluptate dicta' +
      fakePostsBody,
    tags: ['ClassA', 'ClassC'],
    cover: 'https://loremflickr.com/536/354/tree?lock=47',
    reactions: 2,
    user: {
      id: 720,
      username: 'cmasurel1x',
      avatar: 'https://loremflickr.com/80/80/girl?lock=66',
    },
  },
  {
    id: 3,
    postId: 33,
    title: 'dolorum ut in voluptas mollitia et saepe quo animi',
    body:
      'aut dicta possimus sint mollitia voluptas commodi quo doloremque iste corrupti reiciendis voluptatem eius rerum sit cumque quod eligendi laborum minima perferendis recusandae assumenda consectetur porro architecto ipsum ipsam' +
      fakePostsBody,
    tags: ['ClassA', 'ClassD'],
    cover: 'https://loremflickr.com/536/354/apple?lock=78',
    reactions: 5,
    user: {
      id: 701,
      username: 'marausk',
      avatar: 'https://loremflickr.com/80/80/girl?lock=3',
    },
  },
  {
    id: 4,
    postId: 44,
    title: 'aut dolorum aut sunt aut facere repellat provident ',
    body:
      'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto' +
      fakePostsBody,
    tags: ['ClassA', 'ClassB'],
    cover: 'https://loremflickr.com/536/354/cat?lock=4',
    reactions: 2,
    user: {
      id: 76,
      username: 'roorkuse',
      avatar: 'https://loremflickr.com/80/80/man?lock=11',
    },
  },
  {
    id: 5,
    postId: 55,
    title: 'velit dolorum velit sint suscipit perspiciatis velit',
    body:
      'suscipit nam nisi quo aperiam aut asperiores eos fugit maiores voluptatibus quia voluptatem quis ullam qui in alias quia est consequatur magni mollitia accusamus ea nisi voluptate dicta' +
      fakePostsBody,
    tags: ['ClassA', 'ClassC'],
    cover: 'https://loremflickr.com/536/354/bird?lock=100',
    reactions: 2,
    user: {
      id: 11,
      username: 'sanalow',
      avatar: 'https://loremflickr.com/80/80/human?lock=100',
    },
  },
  {
    id: 6,
    postId: 66,
    title:
      'corrupti animi voluptas dolorum ut in voluptas mollitia et saepe quo animi',
    body:
      'corrupti aut dicta possimus sint mollitia voluptas commodi quo doloremque iste corrupti reiciendis voluptatem eius rerum sit cumque quod eligendi laborum minima perferendis recusandae assumenda consectetur porro architecto ipsum ipsam' +
      fakePostsBody,
    tags: ['ClassA', 'ClassD'],
    cover: 'https://loremflickr.com/536/354/animal?lock=20',
    reactions: 5,
    user: {
      id: 3,
      username: 'syl',
      avatar: 'https://loremflickr.com/80/80/girl?lock=311',
    },
  },
  {
    id: 7,
    postId: 77,
    title: 'commodi dolorum ut in voluptas mollitia et saepe quo animi',
    body:
      'commodi aut dicta possimus sint mollitia voluptas commodi quo doloremque iste corrupti reiciendis voluptatem eius rerum sit cumque quod eligendi laborum minima perferendis recusandae assumenda consectetur porro architecto ipsum ipsam' +
      fakePostsBody,
    tags: ['ClassA', 'ClassD'],
    cover: 'https://loremflickr.com/536/354/rock?lock=1',
    reactions: 5,
    user: {
      id: 70,
      username: 'querlrs',
      avatar: 'https://loremflickr.com/80/80/lady?lock=99',
    },
  },
  {
    id: 8,
    postId: 88,
    title: 'reprehenderit aut dolorum aut sunt aut facere repellat ',
    body:
      'reprehenderit quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto' +
      fakePostsBody,
    tags: ['ClassA', 'ClassB'],
    cover: 'https://loremflickr.com/536/354/sheep?lock=18',
    reactions: 2,
    user: {
      id: 70,
      username: 'ublar',
      avatar: 'https://loremflickr.com/80/80/mr?lock=88',
    },
  },
];

const fakeComments = [
  {
    id: 1,
    body: 'This is some awesome thinking! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 11,
    user: {
      id: 63,
      username: 'eburras1q',
      avatar: 'https://loremflickr.com/80/80/people?lock=100',
    },
  },
  {
    id: 2,
    body: 'What terrific math skills you"re showing! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 11,
    user: {
      id: 71,
      username: 'omarsland1y',
      avatar: 'https://loremflickr.com/80/80/girl?lock=34',
    },
  },
  {
    id: 3,
    body: 'You are an amazing writer! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 22,
    user: {
      id: 29,
      username: 'jissetts',
      avatar: 'https://loremflickr.com/80/80/girl?lock=67',
    },
  },
  {
    id: 4,
    body: 'Wow! You have improved so much! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 22,
    user: {
      id: 19,
      username: 'bleveragei',
      avatar: 'https://loremflickr.com/80/80/girl?lock=47',
    },
  },
  {
    id: 5,
    body: 'Nice idea! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 22,
    user: {
      id: 70,
      username: 'cmasurel1x',
      avatar: 'https://loremflickr.com/80/80/boy?lock=22',
    },
  },
  {
    id: 29,
    body: 'This is very perceptive! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 33,
    user: {
      id: 70,
      username: 'omasurex',
      avatar: 'https://loremflickr.com/80/80/man?lock=11',
    },
  },
  {
    id: 30,
    body: 'What an accomplishment! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 33,
    user: {
      id: 70,
      username: 'bmaslrel1x',
      avatar: 'https://loremflickr.com/80/80/gril?lock=55',
    },
  },
  {
    id: 22,
    body: 'This is some awesome thinking! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 44,
    user: {
      id: 63,
      username: 'eburras1q',
      avatar: 'https://loremflickr.com/80/80/boy?lock=39',
    },
  },
  {
    id: 23,
    body: 'What terrific math skills you"re showing! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 44,
    user: {
      id: 71,
      username: 'zmarsland1y',
      avatar: 'https://loremflickr.com/80/80/girl?lock=68',
    },
  },
  {
    id: 31,
    body: 'What an accomplishment! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 55,
    user: {
      id: 70,
      username: 'dmasurel1x',
      avatar: 'https://loremflickr.com/80/80/boy?lock=27',
    },
  },
  {
    id: 91,
    body: 'This is some awesome thinking! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 55,
    user: {
      id: 63,
      username: 'eburras1q',
      avatar: 'https://loremflickr.com/80/80/girl?lock=48',
    },
  },
  {
    id: 20,
    body: 'What an accomplishment! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 33,
    user: {
      id: 70,
      username: 'cmasurel1x',
      avatar: 'https://loremflickr.com/80/80/boy?lock=48',
    },
  },
  {
    id: 13,
    body: 'This is some awesome thinking! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 66,
    user: {
      id: 63,
      username: 'eburras1q',
      avatar: 'https://loremflickr.com/80/80/girl?lock=42',
    },
  },
  {
    id: 92,
    body: 'What terrific math skills you"re showing! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 66,
    user: {
      id: 71,
      username: 'omarsland1y',
      avatar: 'https://loremflickr.com/80/80/man?lock=48',
    },
  },
  {
    id: 81,
    body: 'This is some awesome thinking! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 77,
    user: {
      id: 63,
      username: 'eburras1q',
      avatar: 'https://loremflickr.com/80/80/gril?lock=43',
    },
  },
  {
    id: 12,
    body: 'What terrific math skills you"re showing! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 77,
    user: {
      id: 71,
      username: 'omarsland1y',
      avatar: 'https://loremflickr.com/80/80/boy?lock=20',
    },
  },
  {
    id: 33,
    body: 'You are an amazing writer! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 88,
    user: {
      id: 29,
      username: 'jissetts',
      avatar: 'https://loremflickr.com/80/80/lady?lock=99',
    },
  },
  {
    id: 24,
    body: 'Wow! You have improved so much! Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    postId: 88,
    user: {
      id: 19,
      username: 'bleveragei',
      avatar: 'https://loremflickr.com/80/80/girl?lock=16',
    },
  },
];

const fakeCategories = ['ClassA', 'ClassB', 'ClassC', 'ClassD', 'ClassE'];
