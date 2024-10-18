import { getRepository, Like, Repository } from 'typeorm';
import { Ambassador } from '../entity';
import { CreateAmbassadorDto } from '../types/interfaces/ambassador.types';

export class AmbassadorModel {
  private get entity(): Repository<Ambassador> {
    return getRepository(Ambassador);
  }

  async findAll(contact?: string) {
    const where = contact ? { contact: Like(`%${contact}%`) } : {};
    return this.entity.find({ where });
  }
  create(data: CreateAmbassadorDto) {
    return this.entity.save(data);
  }

  update(id: number, data: CreateAmbassadorDto) {
    return this.entity.update(
      {
        id,
      },
      data,
    );
  }

  delete(id: number) {
    return this.entity.delete({ id });
  }

  findByContact(contact: string) {
    return this.entity.findOne({
      where: {
        contact: Like(`%${contact}%`),
      },
    });
  }

  findByContactAndMethod(contact: string, method: string) {
    return this.entity
      .createQueryBuilder('a')
      .where('LOWER(a.contact) = :contact AND a.method = :method', { contact: contact.toLowerCase(), method })
      .getOne();
  }

  findById(id: number) {
    return this.entity.findOne({
      id,
    });
  }
}

export const ambassadorModel = new AmbassadorModel();
