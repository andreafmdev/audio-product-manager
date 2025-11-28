import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserBody {
  @ApiProperty({
    description: "Email dell'utente",
    example: 'user@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "Password dell'utente (minimo 8 caratteri, almeno 1 simbolo)",
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one symbol',
    },
  )
  password!: string;

  @ApiProperty({
    description: "Nome dell'utente",
    example: 'Mario',
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: "Cognome dell'utente",
    example: 'Rossi',
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;
}
