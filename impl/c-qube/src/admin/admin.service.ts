import { Injectable } from '@nestjs/common';
import { DimensionDataValidator } from '../../../../dx/cqube-spec-checker/dimension.data.validator';
import { DimensionValidator } from '../../../../dx/cqube-spec-checker/dimension.grammar.validator';
import { ValidationError } from './admin.errors';
import * as fs from 'fs';
import { EventGrammarValidator } from './validators/event-grammar.validator';
import { SingleFileValidationResponse } from './dto/response';
import { EventDataValidator } from './validators/event-data.validator';

@Injectable()
export class AdminService {
  checkDimensionDataForValidationErrors(
    grammarContent: string,
    dataContent: string,
  ): SingleFileValidationResponse {
    const dimensionDataValidator = new DimensionDataValidator(
      grammarContent,
      dataContent,
    );
    const errors = dimensionDataValidator.verify();
    return {
      errors,
    };
  }

  checkDimensionGrammarForValidationErrors(
    grammarContent: string,
  ): SingleFileValidationResponse {
    const dimensionGrammarValidator = new DimensionValidator(grammarContent);

    const errors = dimensionGrammarValidator.verify();
    return {
      errors,
    };
  }

  checkEventGrammarForValidationErrors(
    grammarContent: string,
  ): SingleFileValidationResponse {
    const eventGrammarValidator = new EventGrammarValidator(grammarContent);

    const errors = eventGrammarValidator.verify();
    return {
      errors,
    };
  }

  checkEventDataForValidationErrors(
    grammarContent: string,
    dataContent: string,
  ): SingleFileValidationResponse {
    const eventDataValidator = new EventDataValidator(
      grammarContent,
      dataContent,
    );

    const errors = eventDataValidator.verify();
    return {
      errors,
    };
  }
}
