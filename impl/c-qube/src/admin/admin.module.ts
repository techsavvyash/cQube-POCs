import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  // imports: [
  //   MulterModule.register({
  //     dest: './upload',
  //   }),
  // ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
