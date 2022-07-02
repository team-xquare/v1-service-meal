import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CoreModule } from "./core.module";

Date.prototype.toString = function () {
    const year = this.getFullYear();
    const month = (this.getMonth() + 1).toString().padStart(2, "0");
    const date = this.getDate().toString().padStart(2, "0");
    return [year, month, date].join("-");
};

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
