import {
	Controller,
	Delete,
	Put,
	Param,
	Query,
	Body,
	Post,
	Get,
	NotFoundException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

interface ErrorResponse {
	error: string;
}

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(
		@Body() createUserDto: CreateUserDto,
	): Promise<User | undefined> {
		const existingUser = await this.userService.findByUsername(
			createUserDto.username,
		);
		if (existingUser) {
			throw new NotFoundException('Username is already taken');
		}
		const newUser = this.userService.create(createUserDto);
		return newUser;
	}

	@Get()
	async findAll() {
		return this.userService.findAll();
	}

	@Get('id/:id')
	async findOneById(@Param('id') id: string): Promise<User | undefined> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Get(':username')
	async findOneByUsername(
		@Param('username') username: string,
	): Promise<User | undefined> {
		const user = await this.userService.findByUsername(username);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User | { message: string }> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const updatedUser = await this.userService.update(
			parseInt(id),
			updateUserDto,
		);
		return updatedUser || { message: 'User updated successfully' };
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<{ message: string }> {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const tmp = user.username;
		await this.userService.remove(parseInt(id));
		return { message: `User ${tmp} (id: ${id}) removed successfully` };
	}
}
