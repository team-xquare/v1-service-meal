import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { CoreModule } from "./core.module";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import { SentryInterceptor } from "./infrastructure/sentry/interceptor";

Date.prototype.toString = function () {
    const year = this.getFullYear();
    const month = (this.getMonth() + 1).toString().padStart(2, "0");
    const date = this.getDate().toString().padStart(2, "0");
    return [year, month, date].join("-");
};

async function bootstrap() {
    const app = await NestFactory.create(CoreModule, { cors: true });

    const config = new DocumentBuilder().setTitle("Meal service").addTag("meals").build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("meals/api", app, document);

    Sentry.init({
        dsn: process.env.SENTRY_ENV
    });
    app.useGlobalInterceptors(new SentryInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        })
    );

    await app.listen(3000);
}
bootstrap();
