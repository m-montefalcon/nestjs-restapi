import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/definitions/pagination/pagination-query.dto';
import { UserRole } from 'src/definitions/users/user-role.enum';

export class GetUsersQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;
}
