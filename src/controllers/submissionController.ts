import { qualifiersSpreadsheetId } from "@/utils/constants";
import { Submission, SubmissionSet } from "@/models/submission";
import {
  AuthClient,
  getAuthClient,
  getSpreadSheetValues,
} from "@/services/googleSheetsService";
import { parseLocalDate } from "@/utils/dateUtils";
import { QualifierSet, allQualifierSets } from "@/utils/submissionConstants";

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
  isVoidSubmission: 9,
  isPlayerDisqualified: 10,
};

/**
 * The range within each sheet that contains the submission data.
 */
const submissionRange = "A3:L1000";

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
          score: parseInt(row[columnIndexes.songs + 2 * index]),
          ajFcStatus: (row[columnIndexes.songs + 2 * index + 1] ?? "") as
            | ""
            | "FC"
            | "AJ",
        })),
      }));
  }
}
