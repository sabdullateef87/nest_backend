/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(body: AuthDto) {
    try {
      const hash = await argon.hash(body.password);
      const user = new User();
      user.email = body.email;
      user.password = hash;
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  async signin(body: AuthDto) {
    const user = await this.usersRepository.findOneBy({ email: body.email });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.FORBIDDEN);
    }

    const passwordHash = user.password;
    if (await argon.verify(passwordHash, body.password)) {
      const resUser = {
        email: user.email,
        userId: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      };
      return {
        access_token: await this.signToken(user.id, user.email),
        user: resUser,
      };
    } else {
      throw new HttpException(
        { message: 'Password is incorrect' },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  signToken(userId: number, email: string) {
    const payload = { email: email, sub: userId };
    return this.jwtService.signAsync(payload, {
      expiresIn: '60m',
      secret: process.env.JWT_SECRET,
    });
  }
}
