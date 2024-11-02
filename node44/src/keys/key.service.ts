import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KeyService {
  getPublicKey(): string {
    const publicKeyPath = path.resolve(__dirname, '../../keys/public.key');
    try {
      return fs.readFileSync(publicKeyPath, 'utf-8');
    } catch (error) {
      console.error('Error reading public key file:', error);
      throw new Error('Could not read public key file');
    }
  }

  getPrivateKey(): string {
    const privateKeyPath = path.resolve(__dirname, '../../keys/private.key');
    try {
      return fs.readFileSync(privateKeyPath, 'utf-8');
    } catch (error) {
      console.error('Error reading private key file:', error);
      throw new Error('Could not read private key file');
    }
  }
}
