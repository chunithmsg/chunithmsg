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
