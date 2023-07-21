import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileType, FileValidateRequest } from './dto/request';
import { AdminService } from './admin.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

const defaultStorageConfig = diskStorage({
  destination: './upload',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

@Controller('admin')
export class AdminController {
  private logger: Logger;
  constructor(private readonly adminService: AdminService) {
    this.logger = new Logger('Admin Controller');
  }
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
          console.log('file.mimetype: ', file.mimetype);
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
    const dataFilePath = files?.data ? files?.data[0]?.path : undefined;

    let resp;
    switch (body.type.trim()) {
      case FileType.DimensionGrammar:
        resp =
          this.adminService.checkDimensionGrammarForValidationErrors(
            grammarContent,
          );
        break;
      case FileType.DimensionData:
        if (!dataFilePath || !fs.existsSync(dataFilePath))
          throw new BadRequestException('Data file is required');

        resp = this.adminService.checkDimensionDataForValidationErrors(
          grammarContent,
          fs.readFileSync(dataFilePath, 'utf8'),
        );
        break;
      case FileType.EventGrammar:
        resp =
          this.adminService.checkEventGrammarForValidationErrors(
            grammarContent,
          );
        break;
      case FileType.EventData:
        if (!dataFilePath || !fs.existsSync(dataFilePath))
          throw new BadRequestException('Data file is required');

        resp = this.adminService.checkEventDataForValidationErrors(
          grammarContent,
          fs.readFileSync(dataFilePath, 'utf8'),
        );
        break;
      default:
        throw new BadRequestException('Invalid file type');
    }

    // delete the files
    if (grammarFilePath) fs.unlinkSync(grammarFilePath);
    if (dataFilePath) fs.unlinkSync(dataFilePath);

    return resp;
  }

  @Post('bulk')
  @UseInterceptors(
    FileInterceptor('folder', {
      storage: defaultStorageConfig,
    }),
  )
  uploadBulkZip(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    const zipFilePath = file.path;

    const resp = this.adminService.handleZipFile(zipFilePath);
    // delet the file
    if (zipFilePath) fs.unlinkSync(zipFilePath);
    return resp;
  }
}
