import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private users: User[];

  fakeUser = {
    userId: 99,
    username: 'joe',
    password: 'test',
  };

  constructor() {
    this.users = [{ ...this.fakeUser }];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user?.username === username);
  }

  addTestUser() {
    this.users = [{ ...this.fakeUser }];
  }

  removeTestUser() {
    this.users = [];
  }
}
