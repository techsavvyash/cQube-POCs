import { Injectable } from '@nestjs/common';
import { DimensionDataValidator } from '../../../../dx/cqube-spec-checker/dimension.data.validator';
import { DimensionValidator } from '../../../../dx/cqube-spec-checker/dimension.grammar.validator';
import { ValidationError } from './admin.errors';
import * as fs from 'fs';

@Injectable()
export class AdminService {
  checkDimensionDataForValidationErrors(
    grammarContent: string,
    dataContent: string,
  ) {
    const dimensionDataValidator = new DimensionDataValidator(
      grammarContent,
      dataContent,
    );
    const errors = dimensionDataValidator.verify();
    return {
      errors,
    };
  }

  checkDimensionGrammarForValidationErrors(grammarContent: string) {
    const dimensionGrammarValidator = new DimensionValidator(grammarContent);

    const errors = dimensionGrammarValidator.verify();
    return {
      errors,
    };
  }
}
