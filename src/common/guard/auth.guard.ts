import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header topilmadi');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token formati noto\'g\'ri');
    }

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati tugagan');
    }

    // Payload dan user ma'lumotlarini request ga qo'shamiz
    request.user = {
      id: payload.sub,
      email: payload.email,
    };

    return true;
  }
}