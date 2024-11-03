import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { MailService } from 'src/email/email.service';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: MailService
  ) {}

  @Post("/login")
  async login(
    @Body() body: LoginDto,
    @Res() res: Response
  ): Promise<Response<string>>{
    try {
      const result = await this.authService.login(body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
  }

  @Post('/send-email')
  @ApiBody({
    type: EmailDto
  })
  async sendEmail(
    @Body() body: EmailDto,
    @Res() res: Response
  ){
    let emailTo = body.email;
    let subject = body.subject;
    let text = body.text;
    await this.emailService.sendMail(emailTo,subject,text);
    return res.status(200).json({message: "Send mail successfully"})
  }
}
