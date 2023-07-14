import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface ErrorResponse {
	error: string;
}

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async count(): Promise<number> {
		return this.userRepository.count();
	}

	async create(createUserDto: CreateUserDto): Promise<User | ErrorResponse> {
		const existingUser = await this.findByUsername(createUserDto.username);
		if (existingUser) {
			// throw new Error('Username is already taken');
			// Ou bien, vous pouvez renvoyer une réponse avec un code d'erreur approprié
			return { error: 'Username is already taken' };
		}
		const newUser = this.userRepository.create(createUserDto);
		return await this.userRepository.save(newUser);
	}

	async findAll(): Promise<User[]> {
		return await this.userRepository.find();
	}

	async findByUsername(username: string): Promise<User | undefined> {
		return await this.userRepository.findOne({ where: { username } });
	}

	async findOne(id: number): Promise<User | undefined> {
		return await this.userRepository.findOne({ where: { Id_USERS: id } });
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		await this.userRepository.update(id, updateUserDto);
		return await this.userRepository.findOne({ where: { Id_USERS: id } });
	}

	async remove(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}
}
