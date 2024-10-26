import { Injectable } from '@nestjs/common';

// controller trong express

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
