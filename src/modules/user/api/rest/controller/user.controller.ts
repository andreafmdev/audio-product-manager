import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiRole } from '../../../../../libs/api/api-role.enum';
import { AuthRoles } from '../../../../../libs/decorator/auth.decorator';
import { CreateUserBody } from '../presentation/body/create-user.body';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../../application/command/create-user.command';
import { UserRole } from '../../../domain/value-object/user-role.enum';
import { getOrThrowWith } from 'effect/Option';
import {
  PaginatedResponse,
  toPaginatedResponse,
} from '../../../../../libs/api/rest/paginated.response.dto';
import { toUserDto, UserDto } from '../presentation/dto/user.dto';
import { UserParams } from '../presentation/params/user.params';
import { GetAllUsersQuery } from '../../../application/query/get-all-users.query';
import { QueryParams } from '../../../../../libs/decorator/query-params.decorator';
import { QueryParamsValidationPipe } from '../../../../../libs/pipe/query-params-validation.pipe';
import { Collection } from '../../../../../libs/api/rest/collection.interface';
import { User } from '../../../domain/entity/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthRoles(ApiRole.ADMIN)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create user',
    description:
      'Crea un nuovo utente con ruolo USER. Richiede autenticazione ADMIN.',
  })
  @ApiBody({ type: CreateUserBody })
  @ApiResponse({
    status: 204,
    description: 'Utente creato con successo',
  })
  @ApiResponse({
    status: 400,
    description: 'Dati di input non validi',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autenticato',
  })
  @ApiResponse({
    status: 403,
    description: 'Permessi insufficienti (richiede ruolo ADMIN)',
  })
  async createUser(@Body() body: CreateUserBody) {
    getOrThrowWith(
      await this.commandBus.execute(
        this.getCommandForRole(body, UserRole.USER),
      ),
      () => new BadRequestException('Error in User Creation'),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthRoles(ApiRole.ADMIN)
  @Post('/admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create admin user',
    description:
      'Crea un nuovo utente con ruolo ADMIN. Richiede autenticazione ADMIN.',
  })
  @ApiBody({ type: CreateUserBody })
  @ApiResponse({
    status: 204,
    description: 'Admin creato con successo',
  })
  @ApiResponse({
    status: 400,
    description: 'Dati di input non validi',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autenticato',
  })
  @ApiResponse({
    status: 403,
    description: 'Permessi insufficienti (richiede ruolo ADMIN)',
  })
  async createAdminUser(@Body() body: CreateUserBody) {
    getOrThrowWith(
      await this.commandBus.execute(
        this.getCommandForRole(body, UserRole.ADMIN),
      ),
      () => new BadRequestException('Error in Admin Creation'),
    );
  }

  @AuthRoles(ApiRole.ADMIN)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Recupera la lista paginata di tutti gli utenti. Richiede autenticazione ADMIN.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Numero di record da saltare (default: 0)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Numero massimo di record da restituire (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista utenti recuperata con successo',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autenticato',
  })
  @ApiResponse({
    status: 403,
    description: 'Permessi insufficienti (richiede ruolo ADMIN)',
  })
  async getUsers(
    @QueryParams(new QueryParamsValidationPipe()) params: UserParams,
  ): Promise<PaginatedResponse<UserDto>> {
    const users: Collection<User> = await this.queryBus.execute(
      new GetAllUsersQuery(params),
    );
    return toPaginatedResponse(
      {
        items: users.items.map(toUserDto),
        total: users.total,
      },
      params.offset,
      params.limit,
    );
  }

  /**
   *  Helper function to get the CQRS command depending on User role.
   */
  getCommandForRole = (
    body: CreateUserBody,
    role: UserRole,
  ): CreateUserCommand => {
    return new CreateUserCommand(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      role,
    );
  };
}
