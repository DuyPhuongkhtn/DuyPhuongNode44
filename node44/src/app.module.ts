import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // load tất cả biến môi trường và sử dụng ở mọi nơi
    VideoModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// đầu não của module
// liên kết các module con
// export hoặc import 
