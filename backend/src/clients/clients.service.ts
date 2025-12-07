import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto, UpdateClientDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(createClientDto);
    return await this.clientsRepository.save(client);
  }

  async findAll(
    search?: string,
    limit?: number,
    offset?: number,
    updatedSince?: Date,
  ): Promise<{ data: Client[]; total: number }> {
    const queryBuilder = this.clientsRepository
      .createQueryBuilder('client')
      .where('client.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(client.fullName ILIKE :search OR client.phone ILIKE :search OR client.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (updatedSince) {
      queryBuilder.andWhere('client.updatedAt >= :updatedSince', {
        updatedSince,
      });
    }

    const total = await queryBuilder.getCount();

    if (limit) {
      queryBuilder.limit(limit);
    }
    if (offset) {
      queryBuilder.offset(offset);
    }

    queryBuilder.orderBy('client.updatedAt', 'DESC');

    const data = await queryBuilder.getMany();

    return { data, total };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['vehicles'],
    });

    if (!client) {
      throw new NotFoundException(`Клиент с ID ${id} не найден`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return await this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientsRepository.softRemove(client);
  }
}

