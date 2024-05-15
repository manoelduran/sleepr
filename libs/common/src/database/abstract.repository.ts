import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;
  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }
  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.entityRepository.findOne({ where });

    if (!entity) {
      this.logger.warn('Document not found with where', where);
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }
  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const entity = await this.entityRepository.update(where, partialEntity);

    if (!entity.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity was not found');
    }

    return this.findOne(where);
  }
  async find(): Promise<T[]> {
    return this.entityRepository.find();
  }
  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<void> {
    await this.entityRepository.delete(where);
  }
}
