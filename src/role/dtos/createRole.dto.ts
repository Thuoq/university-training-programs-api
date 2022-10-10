import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ResourcesRole {
  @IsNumber()
  @IsNotEmpty()
  resourceId: number;

  @IsOptional()
  @IsBoolean()
  canAdd?: boolean;
  @IsOptional()
  @IsBoolean()
  canView?: boolean;

  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;
  @IsOptional()
  @IsBoolean()
  canEdit?: boolean;
  @IsOptional()
  @IsBoolean()
  canExport?: boolean;
  @IsOptional()
  @IsBoolean()
  canImport?: boolean;
  @IsOptional()
  @IsBoolean()
  canApprove?: boolean;
}
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourcesRole)
  resourcesRoles: ResourcesRole[];
}
