import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CoreModule } from "./core.module";

async function bootstrap() {
    const app = await NestFactory.create(CoreModule, { cors: true });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        })
    );

    await app.listen(3000);
}
bootstrap();
