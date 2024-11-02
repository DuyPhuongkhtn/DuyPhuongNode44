import { Module } from '@nestjs/common';
import { KeyService } from './key.service';

@Module({
  providers: [KeyService],
  exports: [KeyService], // Export KeyService để có thể sử dụng ở module khác
})
export class KeysModule {}
