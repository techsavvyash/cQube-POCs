export class EventGrammarValidator {
  private content: string[];

  constructor(grammarContent: string) {
    this.content = grammarContent
      .split('\n')
      .filter((line) => line.trim() !== '');
  }

  private checkForFileStructure() {
    const errors: any[] = [];
    // check for length
    if (this.content.length !== 5) {
      errors.push({
        row: 0,
        col: 0,
        errorCode: 2005,
        error: 'Structural Error: Event Grammar file should exactly 5 rows',
      });
    }

    // check for equal number of columns in each row
    const colCount = [];
    this.content.forEach((row) => {
      colCount.push(row.split(',').length);
    });

    if (colCount.every((val) => val === colCount[0]) === false) {
      errors.push({
        row: 0,
        col: 0,
        errorCode: 2003,
        error: 'Invalid CSV file: should have equal number of columns',
      });
    }

    // TODO: add check for dimension names

    // TODO: add check for dimension key names

    // Check for supported data types
    const dataTypeRow = this.content[2];
    dataTypeRow.split(',').forEach((dataType: string) => {
      if (!['string', 'number', 'date'].includes(dataType)) {
        errors.push(`Invalid data type: ${dataType}`);
      }
    });
    // TODO: Add check to ensure the mentioned data type matches the dimension's datatype
  }
}
