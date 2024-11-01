import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [VideoController],
  providers: [VideoService, JwtStrategy]
})
export class VideoModule {}
