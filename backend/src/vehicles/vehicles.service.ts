import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from './dto';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private readonly clientsService: ClientsService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Проверяем существование клиента
    await this.clientsService.findOne(createVehicleDto.clientId);

    // Проверяем уникальность VIN, если указан
    if (createVehicleDto.vin) {
      const existingVin = await this.vehiclesRepository.findOne({
        where: { vin: createVehicleDto.vin, deletedAt: null },
      });
      if (existingVin) {
        throw new BadRequestException('Автомобиль с таким VIN уже существует');
      }
    }

    // Проверяем уникальность госномера, если указан
    if (createVehicleDto.plateNumber) {
      const existingPlate = await this.vehiclesRepository.findOne({
        where: { plateNumber: createVehicleDto.plateNumber, deletedAt: null },
      });
      if (existingPlate) {
        throw new BadRequestException('Автомобиль с таким госномером уже существует');
      }
    }

    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    const savedVehicle = await this.vehiclesRepository.save(vehicle);
    // Загружаем с клиентом для возврата
    return await this.vehiclesRepository.findOne({
      where: { id: savedVehicle.id },
      relations: ['client'],
    }) || savedVehicle;
  }

  async findAll(
    clientId?: string,
    vin?: string,
    plateNumber?: string,
    updatedSince?: Date,
  ): Promise<Vehicle[]> {
    const queryBuilder = this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.client', 'client')
      .leftJoinAndSelect(
        'vehicle.repairs',
        'lastRepair',
        'lastRepair.deletedAt IS NULL',
      )
      .where('vehicle.deletedAt IS NULL');

    if (clientId) {
      queryBuilder.andWhere('vehicle.clientId = :clientId', { clientId });
    }

    if (vin) {
      queryBuilder.andWhere('vehicle.vin ILIKE :vin', { vin: `%${vin}%` });
    }

    if (plateNumber) {
      queryBuilder.andWhere('vehicle.plateNumber ILIKE :plateNumber', {
        plateNumber: `%${plateNumber}%`,
      });
    }

    if (updatedSince) {
      queryBuilder.andWhere('vehicle.updatedAt >= :updatedSince', {
        updatedSince,
      });
    }

    queryBuilder.orderBy('vehicle.updatedAt', 'DESC');

    const vehicles = await queryBuilder.getMany();

    // Оставляем только последний ремонт для каждого автомобиля (по дате reportedAt)
    return vehicles.map((vehicle) => {
      if (vehicle.repairs && vehicle.repairs.length > 0) {
        // Сортируем ремонты по дате reportedAt (последний первым) и берем первый
        const sortedRepairs = [...vehicle.repairs].sort(
          (a, b) =>
            new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
        );
        vehicle.repairs = [sortedRepairs[0]];
      }
      return vehicle;
    });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['client', 'repairs'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Автомобиль с ID ${id} не найден`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    // Проверяем уникальность VIN, если он изменяется
    if (updateVehicleDto.vin && updateVehicleDto.vin !== vehicle.vin) {
      const existingVin = await this.vehiclesRepository.findOne({
        where: { vin: updateVehicleDto.vin, deletedAt: null },
      });
      if (existingVin) {
        throw new BadRequestException('Автомобиль с таким VIN уже существует');
      }
    }

    // Проверяем уникальность госномера, если он изменяется
    if (
      updateVehicleDto.plateNumber &&
      updateVehicleDto.plateNumber !== vehicle.plateNumber
    ) {
      const existingPlate = await this.vehiclesRepository.findOne({
        where: {
          plateNumber: updateVehicleDto.plateNumber,
          deletedAt: null,
        },
      });
      if (existingPlate) {
        throw new BadRequestException('Автомобиль с таким госномером уже существует');
      }
    }

    Object.assign(vehicle, updateVehicleDto);
    return await this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehiclesRepository.softRemove(vehicle);
  }
}

