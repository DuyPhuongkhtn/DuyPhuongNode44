import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { KeyService } from 'src/keys/key.service';

@Injectable()
export class AuthService {
    prisma = new PrismaClient();
    privatekey: string;
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private keyService: KeyService
    ){
        // load private key from file
        this.privatekey = this.keyService.getPrivateKey();
    }

    // async login(body: LoginDto): Promise<string> {
    //     try {
    //         const {email, pass_word} = body;
    //         const checkUser = await this.prisma.users.findFirst({
    //             where: {email}
    //         });
    //         if (!checkUser) {
    //             throw new BadRequestException("Email is wrong");
    //         };
    //         const checkPass = checkUser.pass_word === pass_word;
    //         if (!checkPass) {
    //             throw new BadRequestException("Password is wrong");
    //         }

    //         const token = this.jwtService.sign(
    //             {data: {userId: checkUser.user_id}},
    //             {
    //                 expiresIn: "30m",
    //                 secret: this.configService.get("SECRET_KEY")
    //             }
    //         )
    //         return token;
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }

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
                    algorithm: 'RS256',
                    privateKey: this.privatekey
                }
            )
            return token;
        } catch (error) {
            throw new Error(error);
        }
    }
}
