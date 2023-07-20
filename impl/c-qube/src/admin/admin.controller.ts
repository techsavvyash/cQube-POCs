import { Body, Controller, Get, Post } from '@nestjs/common';
import { FileType, SingleFileValidateRequest } from './dto/request';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get()
  getHello(): string {
    return 'Hello from Admin API!';
  }

  @Post('/validate')
  validateData(@Body() data: SingleFileValidateRequest) {
    switch (data.type) {
      case FileType.DimensionGrammar:
        return this.adminService.checkDimensionGrammarForValidationErrors(
          data.content.grammarContent,
        );
      case FileType.DimensionData:
        return this.adminService.checkDimensionDataForValidationErrors(
          data.content.grammarContent,
          data.content.dataContent,
        );

      case FileType.EventGrammar:
        // return this.adminService.validate(data.content);
        return {
          errors: [
            {
              row: '1',
              col: '2',
              errorCode: 1001,
              error: 'API is a WIP',
            },
          ],
        };
      case FileType.EventData:
        // return this.adminService.validate(data.content);
        return {
          errors: [
            {
              row: '1',
              col: '2',
              errorCode: 1001,
              error: 'API is a WIP',
            },
          ],
        };
    }
  }
}
