import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_API } from '../../../libs/decorator/auth.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check se la route è pubblica
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_API, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
