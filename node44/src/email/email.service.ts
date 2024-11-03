import { Injectable } from "@nestjs/common";
import {Transporter, createTransport} from 'nodemailer';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter: Transporter;

    constructor(
        private configService: ConfigService
    ) {
        this.transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS')
            }
        })
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to,
            subject,
            text,
            html
        }

        return await this.transporter.sendMail(mailOptions);
    }
}