import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // 可以換成自己的網址，或是設置為 * 來允許所有網址
    origin: [
      'https://jiahongl.github.io',
      'http://localhost:4200',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:3006'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  }); // 啟用跨域請求
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();

function setupSwagger(app: INestApplication) {
  const builder = new DocumentBuilder();
  const config = builder
    .setTitle('RefreshTokenPractice')
    .setDescription(
      `這是一組用來練習前端 refresh token 的 APIs。<br> 
       > 預設 accessToken 5秒會過期，除了 登入帳號/取得新的 Tokens/註冊帳號/刪除帳號 沒有驗證 accessToken，其他 API 都可練習 401 或 403 的情境。<br>
       PS : 此 Swagger 的 token 前面不需加上 bearer (已幫加)，但撰寫前端程式碼請記得加上 bearer :")
      `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
