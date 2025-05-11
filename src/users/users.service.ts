import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserRequest } from './dto/create-user.request';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(data: CreateUserRequest) {
    try {
      console.log(data);
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: await hash(data.password, 10),
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException('Email already exists.');
      }
      throw error;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }
}
