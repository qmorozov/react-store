import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/models/UserRole';

export const enum AuthGuardType {
  Signed = 'signed',
  Roles = 'roles',
}

export const enum SignedType {
  SignedOnly,
  SignedAndUnsigned,
  UnsignedOnly,
}

export interface AuthGuardMetadata {
  [AuthGuardType.Signed]: SignedType;
  [AuthGuardType.Roles]: UserRole[];
}

export const AuthGuardMetadataKey = '@AuthMetadata';

function AuthMetadata(options: Partial<AuthGuardMetadata>) {
  // const currentMetadata = getMetadata(AuthGuardMetadataKey);
  const metadata: AuthGuardMetadata = Object.assign(
    {
      [AuthGuardType.Signed]: SignedType.SignedAndUnsigned,
      [AuthGuardType.Roles]: [],
    },
    options,
  );
  return SetMetadata(AuthGuardMetadataKey, metadata);
}

export const UserSignedOnly = () =>
  AuthMetadata({
    [AuthGuardType.Signed]: SignedType.SignedOnly,
  });

export const UserRolesOnly = (...roles: UserRole[]) =>
  AuthMetadata({
    [AuthGuardType.Signed]: SignedType.SignedOnly,
    [AuthGuardType.Roles]: roles,
  });

export const AdminOnly = () => UserRolesOnly(UserRole.Admin);
