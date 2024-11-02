import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt'
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { KeysModule } from 'src/keys/key.module';

@Module({
  imports: [JwtModule.register({}), KeysModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
