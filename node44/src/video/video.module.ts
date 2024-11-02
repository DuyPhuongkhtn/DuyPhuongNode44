import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { SharedModule } from 'src/shared/shared.module';
import { KeysModule } from 'src/keys/key.module';

@Module({
  imports: [SharedModule, KeysModule],
  controllers: [VideoController],
  providers: [VideoService, JwtStrategy]
})
export class VideoModule {}
