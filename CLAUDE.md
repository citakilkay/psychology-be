# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS 11 backend for a psychology platform with multi-tenant RBAC, JWT dual-token auth, and PostgreSQL via TypeORM.

## Common Commands

```bash
npm run start:dev          # Dev server with watch mode
npm run build              # Build to dist/
npm run start:prod         # Production (node dist/main)
npm run lint               # ESLint with auto-fix
npm run format             # Prettier
npm run test               # Unit tests (Jest)
npm run test:watch         # Unit tests in watch mode
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage report
```

Run a single test: `npx jest --testPathPattern=<pattern>`

## Architecture

**Module pattern:** Each feature follows Controller → Service → TypeORM Repository. Modules live in `src/app/` with consistent structure: `module.ts`, `controller.ts`, `service.ts`, `dto/payload.dto.ts`, `dto/response.dto.ts`.

**Feature modules:** `auth`, `users`, `roles`, `permissions`, `tenants`

**Auth system:** Dual-token JWT (access + refresh). Three Passport strategies: `LocalStrategy` (login), `JwtStrategy` (access token from Authorization header), `RefreshJwtStrategy` (refresh token from cookies). Passwords hashed with Argon2. Refresh tokens stored hashed in `Usership` entity.

**Permission system:** Hierarchical `Parent:Child` format (e.g., `User:Read`). Applied via `@RequirePermissions()` decorator + `PermissionGuard`. Four role groups: Client, Operator, Admin, SuperAdmin.

**Guard stacking pattern:**
```typescript
@RequirePermissions(AppPermission.UserRead)
@UseGuards(JwtAuthGuard, PermissionGuard)
```

**Database:** PostgreSQL on Supabase. All entities extend `EntityBase` (UUID pk, timestamps, soft-delete via `deletedAt`). `synchronize: true` — no migration files, schema auto-syncs. Seeding runs automatically on app startup via `AppModule.onModuleInit()`.

**Multi-tenancy:** Users optionally belong to a tenant. Tenant-scoped filtering applied in service queries.

**Shared utilities (`src/shared/`):**
- `config.ts` — centralized env config with typed getters (`mustGetEnv`, `getIntEnv`, `getBoolEnv`)
- `decorators/` — `@GetUser()` (extracts user from request), `@RequirePermissions()`
- `enums/` — `AppPermission`, `RoleGroup`
- `filters/` — global `AllExceptionsFilter`
- `utils/handlers/` — Argon2 helpers, search condition builder, DB exception formatter

**DTO conventions:** Payload DTOs use `class-validator` decorators. Response DTOs use `@Expose()` from `class-transformer` for serialization control.

**Search/pagination:** `handleSearchConditions()` utility builds OR-based TypeORM `where` clauses. Endpoints accept `page`, `pageSize`, `orderBy`, `orderDirection` query params.

## Environment Variables

Required in `.env`:
```
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
AUTO_LOAD_ENTITIES, SYNCHRONIZE, SSL_REJECT_UNAUTHORIZED
JWT_SECRET, JWT_REFRESH_TOKEN_SECRET
JWT_EXPIRED_IN_HOURS, JWT_REFRESH_TOKEN_EXPIRED_IN_HOURS
PORT
SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD, SUPERADMIN_EMAIL_ADDRESS
```

## Code Style

- TypeScript target ES2022, CommonJS modules
- `strictNullChecks: false` in tsconfig
- Single quotes, trailing commas (Prettier)
- ESLint allows implicit return types and `any`
