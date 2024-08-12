import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthApiController } from './controller/auth.api.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthOauthController } from './controller/auth.oauth.controller';
import { FacebookStrategy } from './strategy/facebook.strategy';

@Module({
  controllers: [AuthController, AuthApiController, AuthOauthController],
  providers: [GoogleStrategy, FacebookStrategy],
})
export class AuthModule {}
