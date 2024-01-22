import { Submission, SubmissionSet } from '@/models/submission';
import {
  AuthClient,
  getAuthClient,
  getSpreadSheetValues,
} from '@/services/googleSheetsService';
import {
  qualifiersSpreadsheetId,
  parseLocalDate,
  QualifierSet,
  allQualifierSets,
} from '@/libs';

/**
 * The Sheet names for each of the qualifier sets, in the Google Spreadsheet
 */
const sheetNames = {
  [QualifierSet.MastersA]: "S.S.L. Qualifiers",
};

const columnIndexes = {
  formSubmissionTimestamp: 0,
  timestamp: 1,
  ign: 2,
  songs: 3,
  isVoidSubmission: 10,
  isPlayerDisqualified: 11,
};

/**
 * The range within each sheet that contains the submission data.
 */
const submissionRange = 'A3:M1000';

export type SubmissionOptions = {
  /**
   * A timestamp, indicating only to fetch submissions with timestamps up
   * to (and including) the specified timestamp. If unspecified, all
   * submissions will be fetched regardless of timestamp.
   */
  timestampLimit?: number;
  /**
   * A timestamp, indicating only to fetch submissions with form submission
   * timestamps up to (and including) the specified timestamp. If unspecified,
   * all submissions will be fetched regardless of form submission timestamp.
   */
  formSubmissionTimestampLimit?: number;
}

/**
 * Checks if the specified row, which represents a submission to parse, is completely filled.
 * An incomplete row is one where a mandatory field has not been filled out.
 *
 * @param row The row to check, representing a submission
 * @returns true iff the row has been filled out completely
 */
export const isCompleteSubmissionRow = (row: string[]) => {
  const indexesToCheck = [
    columnIndexes.formSubmissionTimestamp,
    columnIndexes.timestamp,
    columnIndexes.ign,
    ...[0, 1, 2].map((i) => columnIndexes.songs + 2 * i),
  ];

  return row && indexesToCheck.every((index) => row[index]);
};

/**
 * Attempts to parse a submission row, where undefined is returned when
 * the parsing fails.
 *
 * @param row The row to parse
 * @returns The parsed Submission, or undefined if an error occurred.
 */
export const tryParseSubmissionRow = (
  row: string[],
): Submission | undefined => {
  try {
    const timestamp = parseLocalDate(row[columnIndexes.timestamp]).getTime();
    const formSubmissionTimestamp = parseLocalDate(
      row[columnIndexes.formSubmissionTimestamp],
    ).getTime();
    const songScores = [0, 1, 2].map((index) => ({
      score: parseInt(row[columnIndexes.songs + 2 * index], 10),
      ajFcStatus: (row[columnIndexes.songs + 2 * index + 1] ?? '') as
        | ''
        | 'FC'
        | 'AJ',
    }));

    // Check if any of the numerical fields was parsed to NaN.
    if (
      [
        timestamp,
        formSubmissionTimestamp,
        ...songScores.map(({ score }) => score),
      ].some(Number.isNaN)
    ) {
      throw new Error('One of the numerical fields is parsed as NaN.');
    }

    return {
      timestamp,
      formSubmissionTimestamp,
      ign: row[columnIndexes.ign],
      isDisqualified: row[columnIndexes.isPlayerDisqualified] === 'TRUE',
      isVoidSubmission: row[columnIndexes.isVoidSubmission] === 'TRUE',
      songScores,
    };
  } catch (error) {
    console.error(
      `Parsing error occurred when attempting to parse: ${JSON.stringify(
        row,
      )}.`,
    );
    console.error(error);
    return undefined;
  }
};

const notUndefined = <TValue>(value: TValue | undefined): value is TValue => value !== undefined;

export class SubmissionController {
  authClient?: AuthClient;

  async initialise() {
    // Opening myself up to race conditions, but I'll deal with those later.
    if (this.authClient !== undefined) {
      return;
    }

    this.authClient = await getAuthClient();
  }

  async getAllSubmissions(options?: SubmissionOptions) {
    const output: { [S in QualifierSet]?: Submission[] } = {};

    // Not taking advantage of possibilities of concurrency/parallelism,
    // but that can be a problem for the future. This is good enough.
    for (const qualifierSet of allQualifierSets) {
      output[qualifierSet] = await this.getSubmissionForSet(
        qualifierSet,
        options,
      );
    }

    return output as SubmissionSet;
  }

  private async getSubmissionForSet(
    qualifierSet: QualifierSet,
    options?: SubmissionOptions,
  ): Promise<Submission[]> {
    const response = await getSpreadSheetValues(
      qualifiersSpreadsheetId,
      this.authClient,
      `${sheetNames[qualifierSet]}!${submissionRange}`,
    );

    const values = response.data.values as string[][] | null | undefined;
    if (!values) {
      // A null or undefined response is likely due to the sheet being empty in
      // the searched range.
      return [];
    }

    return values
      .filter(isCompleteSubmissionRow)
      .map(tryParseSubmissionRow)
      .filter(notUndefined)
      .filter(({ timestamp }) =>
        // Filter by timestamp, if specified in options.
        options?.timestampLimit === undefined
          ? true
          : timestamp <= options.timestampLimit,
      )
      .filter(({ formSubmissionTimestamp }) =>
        options?.formSubmissionTimestampLimit === undefined
          ? true
          : formSubmissionTimestamp !== undefined &&
            formSubmissionTimestamp <= options.formSubmissionTimestampLimit,
      );
  }
}
