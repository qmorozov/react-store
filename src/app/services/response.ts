import { BadRequestException } from '@nestjs/common';

export abstract class AppResponse {
  // static ok(payload: any) {
  //   const response = {
  //     code: 'OK',
  //   };
  //
  //   if (payload) {
  //     response['payload'] = payload;
  //   }
  //
  //   return response;
  // }

  static badRequest(error: any) {
    const response = {
      code: 'BAD_REQUEST',
    };

    if (error) {
      response['error'] = error;
    }

    return response;
  }

  static throwBadRequest(error: any) {
    throw new BadRequestException(AppResponse.badRequest(error));
  }
}
