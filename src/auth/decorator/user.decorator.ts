import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Express } from 'express';
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
