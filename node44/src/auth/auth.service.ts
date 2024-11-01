import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
    prisma = new PrismaClient();
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async login(body: LoginDto): Promise<string> {
        try {
            const {email, pass_word} = body;
            const checkUser = await this.prisma.users.findFirst({
                where: {email}
            });
            if (!checkUser) {
                throw new BadRequestException("Email is wrong");
            };
            const checkPass = checkUser.pass_word === pass_word;
            if (!checkPass) {
                throw new BadRequestException("Password is wrong");
            }

            const token = this.jwtService.sign(
                {data: {userId: checkUser.user_id}},
                {
                    expiresIn: "30m",
                    secret: this.configService.get("SECRET_KEY")
                }
            )
            return token;
        } catch (error) {
            throw new Error(error);
        }
    }
}
