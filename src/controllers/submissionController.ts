import { qualifiersSpreadsheetId } from "@/constants";
import { Submission } from "@/models/submission";
import {
  AuthClient,
  getAuthClient,
  getSpreadSheetValues,
} from "@/services/googleSheetsService";
import { parseLocalDate } from "@/utils/dateUtils";

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

/**
 * The range within each sheet that contains the submission data.
 */
const submissionRange = "A3:L1000";

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
      .filter((row) => row && row[0] !== "")
      .map<Submission>((row) => ({
        timestamp: parseLocalDate(row[columnIndexes.timestamp]).getTime(),
        ign: row[columnIndexes.ign],
        isDisqualified: row[columnIndexes.isPlayerDisqualified] === "TRUE",
        isVoidSubmission: row[columnIndexes.isVoidSubmission] === "TRUE",
        songScores: [0, 1, 2].map((index) => ({
          score: parseInt(row[columnIndexes.songs + index]),
          // TODO: Reorder columns in Google Sheet and remove magic number
          ajFcStatus: (row[9 + index] ?? "") as "" | "FC" | "AJ",
        })),
      }));
  }
}
