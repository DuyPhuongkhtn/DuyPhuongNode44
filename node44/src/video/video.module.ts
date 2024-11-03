import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { ShareModule } from 'src/shared/sharedModule';
import { KeyModule } from 'src/key/key.module';

@Module({
  imports: [ShareModule, KeyModule],
  controllers: [VideoController],
  providers: [VideoService, JwtStrategy]
})
export class VideoModule {}
// DI: dependency inject
// class A
// class B <- class A
