import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/definitions/users/user-role.enum';

export class GetUsersQueryDto {
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    created_by?: string;
}
