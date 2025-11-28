import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_ROLES_KEY } from '../../../libs/decorator/auth.decorator';
import { ApiRole } from '../../../libs/api/api-role.enum';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class SupabaseRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ApiRole[]>(
      AUTH_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUserDto | undefined = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userRole = this.mapRoleToApiRole(user.role);
    const hasRole = requiredRoles.includes(userRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }

  private mapRoleToApiRole(role: string): ApiRole {
    const roleUpper = role.toUpperCase();
    if (roleUpper === 'ADMIN' || roleUpper === '0') {
      return ApiRole.ADMIN;
    }
    return ApiRole.USER;
  }
}
