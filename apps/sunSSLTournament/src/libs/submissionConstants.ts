// TODO: convert this into as const for scalability
// * this is because enums suck in ts
// * literally the scum of ts, should never be used and should be removed from the language
// * use as const instead
/**
 * The qualifiers set.
 */
export enum QualifierSet {
  MastersA,
}

/**
 * An array of all the members of QualifierSet.
 *
 * I am way too fed up with finding a simple and clean way to iterate through the members of an enum.
 * This is not scalable and I don't care.
 *
 * 22 Jan 24 Update: Leaving this as a singleton array for now, in case there are future tournaments
 * that require more than one qualifier set.
 */
export const allQualifierSets = [QualifierSet.MastersA];

/**
 * The Sheet names for each of the qualifier sets, in the Google Spreadsheet
 */
export const sheetNames = {
  [QualifierSet.MastersA]: 'S.S.L. Qualifiers',
};

export const columnIndexes = {
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
export const submissionRange = 'A3:M1000';

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
};
