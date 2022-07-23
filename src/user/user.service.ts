import { Inject } from '@nestjs/common';
import { TenantService } from '../tenant/tenant-service.decorator';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { User } from './user.entity';

@TenantService()
export class UserService {

  constructor(@Inject(TENANT_CONNECTION) private connection) {}
  repository = this.connection.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }
}
