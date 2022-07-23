import { BadRequestException, MiddlewareConsumer, Module, Scope } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
export const TENANT_CONNECTION = 'TENANT_CONNECTION';
export let createdConnection // variável de conexão

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [
    {
      provide: TENANT_CONNECTION,
      scope: Scope.REQUEST,
      useFactory: async () => {
        // retorna a conexão do host que fez a requisição
        return createdConnection
      }
    }
  ],
  exports: [ TENANT_CONNECTION ]
})

export class TenantModule {
  constructor(@InjectRepository(Tenant)
                private readonly tenantRepository: Repository<Tenant>) { }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req, res, next) => {
        
        // retorna o esquema do solicitente
        const tenant: Tenant = await this.tenantRepository.findOne(({ where: { host: req.headers.sys } }));

        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'There is a Error with the Database!',
          );
        }

        try {
          createdConnection(tenant.name);    
          next();
        } catch (e) {
          // cria a conexão
          createdConnection = new DataSource({
            name: tenant.name,
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: 'root',
            password: 'password',
            database: tenant.name,
            entities: [ User ],
            synchronize: true,
          })
          await createdConnection.connect()
          
          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        }
      }).forRoutes('*');
  }
}
