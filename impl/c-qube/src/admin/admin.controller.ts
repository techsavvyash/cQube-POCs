import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileType, FileValidateRequest } from './dto/request';
import { AdminService } from './admin.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

const defaultStorageConfig = diskStorage({
  destination: './upload',
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get()
  getHello(): string {
    return 'Hello from Admin API!';
  }

  @Post('validate')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'grammar', maxCount: 1 },
        { name: 'data', maxCount: 1 },
      ],
      {
        storage: defaultStorageConfig,
        fileFilter(req, file, callback) {
          if (file.mimetype !== 'text/csv') {
            return callback(
              new BadRequestException('Only CSV files are allowed'),
              false,
            );
          }
          callback(null, true);
        },
      },
    ),
  )
  uploadFile(
    @UploadedFiles()
    files: {
      grammar?: Express.Multer.File[];
      data?: Express.Multer.File[];
    },
    @Body() body: FileValidateRequest,
  ) {
    console.log(files.grammar);
    const grammarFilePath = files.grammar[0].path;

    if (!grammarFilePath || !fs.existsSync(grammarFilePath))
      throw new BadRequestException('Grammar file is required');

    const grammarContent = fs.readFileSync(grammarFilePath, 'utf8');
    const dataFilePath = files.data[0].path;

    switch (body.type.trim()) {
      case FileType.DimensionGrammar:
        return this.adminService.checkDimensionGrammarForValidationErrors(
          grammarContent,
        );
      case FileType.DimensionData:
        if (!dataFilePath || !fs.existsSync(dataFilePath))
          throw new BadRequestException('Data file is required');

        return this.adminService.checkDimensionDataForValidationErrors(
          grammarContent,
          fs.readFileSync(dataFilePath, 'utf8'),
        );
      case FileType.EventGrammar:
        return this.adminService.checkEventGrammarForValidationErrors(
          grammarContent,
        );
      case FileType.EventData:
        if (!dataFilePath || !fs.existsSync(dataFilePath))
          throw new BadRequestException('Data file is required');

        return this.adminService.checkEventDataForValidationErrors(
          grammarContent,
          fs.readFileSync(dataFilePath, 'utf8'),
        );
      default:
        throw new BadRequestException('Invalid file type');
    }
  }
}
