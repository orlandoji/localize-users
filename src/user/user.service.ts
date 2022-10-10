import { UserDTO } from './dto/user.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../common/models/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getMany() {
    return await this.userRepository.find();
  }

  async getOne(id) {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException('User does not exists');

    return user;
  }
  async create(dto: UserDTO) {
    const userExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (userExist)
      throw new BadRequestException('User already registered with email');

    const newUser = this.userRepository.create(dto);
    const user = await this.userRepository.save(newUser);

    delete user.password;
    return user;
  }
  async update(id: number, dto: UserDTO) {
    const user = await this.getOne(id);
    const editedUser = Object.assign(user, dto);
    return await this.userRepository.save(editedUser);
  }
  async delete(id: string) {
    const user = await this.getOne(id);
    return await this.userRepository.remove(user);
  }

  async findOne(data: UserDTO) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.password')
      .getOne();
  }
}
