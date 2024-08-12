import { Injectable } from '@nestjs/common';
import environment from '../../app/configuration/configuration.env';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class EmailService {
  private readonly templates = {
    register: '5eb61e2b-a699-4fed-b155-a15a09bf9710',
    forgotPassword: 'f7ca6749-257e-4a81-bd7e-8242c72c17b0',
  };

  private readonly mailClient = new MailtrapClient({
    endpoint: environment.mailtrap.endpoint,
    token: environment.mailtrap.token,
  });

  async sendRegister(
    email: string,
    subject: string,
    parameters: {
      verifyUrl: string;
      name: string;
    },
  ) {
    return this.mailClient
      .send({
        from: environment.mailtrap.sender,
        to: [{ email }],
        template_uuid: this.templates.register,
        template_variables: parameters,
      })
      .catch((err) => {
        console.log(err, 'Error');
        throw err;
      });
  }

  async sendForgotPassword(
    email: string,
    subject: string,
    parameters: {
      resetPasswordUrl: string;
      name: string;
      email: string;
      supportEmail: string;
    },
  ) {
    return this.mailClient
      .send({
        from: environment.mailtrap.sender,
        to: [{ email }],
        template_uuid: this.templates.forgotPassword,
        template_variables: parameters,
      })
      .catch((err) => {
        console.log(err, 'Error');
        throw err;
      });
  }
}
