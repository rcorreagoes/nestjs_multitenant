import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant/tenant.entity';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'tenant',
      entities: [ Tenant ],
      synchronize: true,
    }),
    TenantModule,
    UserModule,
  ]
})
export class AppModule {}
