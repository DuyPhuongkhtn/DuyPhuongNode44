import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('SECRET_KEY'),
        });
    }
    prisma = new PrismaClient();

    async validate(tokenDecode: any) {
        console.log("tokenDecode: ", tokenDecode)
        let userId = tokenDecode.data.userId;
        const checkUser = await this.prisma.users.findFirst({
            where: {user_id: userId}
        });
        if (!checkUser) {
            return false;
        }
        return tokenDecode
    }
}