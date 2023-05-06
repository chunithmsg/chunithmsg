import { qualifiersSpreadsheetId } from "@/constants";
import { Submission } from "@/models/submission";
import {
  AuthClient,
  getAuthClient,
  getSpreadSheetValues,
} from "@/services/googleSheetsService";

/**
 * The three qualifiers sets - one for Challengers and two for Masters.
 */
export enum QualifierSet {
  Challengers,
  MastersA,
  MastersB,
}

/**
 * An array of all the members of QualifierSet.
 *
 * I am way too fed up with finding a simple and clean way to iterate through the members of an enum.
 * This is not scalable and I don't care.
 */
export const allQualifierSets = [
  QualifierSet.Challengers,
  QualifierSet.MastersA,
  QualifierSet.MastersB,
];

/**
 * The Sheet names for each of the qualifier sets, in the Google Spreadsheet
 */
const sheetNames = {
  [QualifierSet.Challengers]: "Challengers - Dumping Ground",
  [QualifierSet.MastersA]: "Masters Set A - Dumping Ground",
  [QualifierSet.MastersB]: "Masters Set B - Dumping Ground",
};

const columnIndexes = {
  timestamp: 0,
  ign: 1,
  songs: 2,
  isVoidSubmission: 6,
  isPlayerDisqualified: 7,
};

const parseLocalDate = (dateTimeString: string) => {
  const tokens = dateTimeString.split(/\D/).map(parseInt);
  const pseudoTimestamp = Date.UTC(
    tokens[0],
    tokens[1] - 1,
    tokens[2],
    tokens[3],
    tokens[4]
  );

  // The offset for GMT+8.
  //
  // I'm fed up with trying to find a nice way to do something like
  // timezoneOffsetOf("Asia/Singapore"), and I can sort of understand
  // why with DST and all that stuff, but wow am I just tired of trying
  // to find a 'nice' solution.
  const timezoneOffset = 8 * 60 * 1000;

  return new Date(pseudoTimestamp - timezoneOffset);
};

/**
 * The range within each sheet that contains the submission data.
 */
const submissionRange = "A3:H1000";

export type SubmissionSet = { [S in QualifierSet]: Submission[] };

export class SubmissionController {
  authClient?: AuthClient;

  async initialise() {
    // Opening myself up to race conditions, but I'll deal with those later.
    if (this.authClient !== undefined) {
      return;
    }

    this.authClient = await getAuthClient();
  }

  async getAllSubmissions() {
    const output: { [S in QualifierSet]?: Submission[] } = {};

    // Not taking advantage of possibilities of concurrency/parallelism,
    // but that can be a problem for the future. This is good enough.
    for (const qualifierSet of allQualifierSets) {
      output[qualifierSet] = await this.getSubmissionForSet(qualifierSet);
    }

    return output as SubmissionSet;
  }

  private async getSubmissionForSet(
    qualifierSet: QualifierSet
  ): Promise<Submission[]> {
    const response = await getSpreadSheetValues(
      qualifiersSpreadsheetId,
      this.authClient,
      `${sheetNames[qualifierSet]}!${submissionRange}`
    );

    const values = response.data.values as string[][] | null | undefined;
    if (!values) {
      // A null or undefined response is likely due to the sheet being empty in
      // the searched range.
      return [];
    }

    return values
      .filter((row) => row[0] !== "")
      .map<Submission>((row) => ({
        timestamp: parseLocalDate(row[columnIndexes.timestamp]),
        ign: row[columnIndexes.ign],
        isDisqualified: row[columnIndexes.isPlayerDisqualified] === "TRUE",
        isVoidSubmission: row[columnIndexes.isVoidSubmission] === "TRUE",
        songScores: [0, 1, 2].map((index) =>
          parseInt(row[columnIndexes.songs + index])
        ) as [number, number, number],
      }));
  }
}
