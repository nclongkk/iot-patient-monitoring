import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';

@Injectable()
export class AppRepository {
  constructor(@Inject(ModuleRef) private readonly moduleRef: ModuleRef) {}

  use<T>(entity: new () => T): Repository<T> {
    const repo = entity.name.toUpperCase() + '_REPOSITORY';
    return this.moduleRef.get(repo, { strict: false });
  }
}
