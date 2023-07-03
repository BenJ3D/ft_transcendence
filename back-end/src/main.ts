import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const ioAdapter = new IoAdapter(app);
	app.enableCors({
		origin: 'http://localhost:3000',
	});
	app.useWebSocketAdapter(ioAdapter);
	await app.listen(8000);
}
bootstrap();
