// TODO: convert this into as const for scalability
// * this is because enums suck in ts
// * literally the scum of ts, should never be used and should be removed from the language
// * use as const instead
/**
 * The two qualifiers sets.
 */
export enum QualifierSet {
  MastersA,
  MastersB,
}

/**
 * An array of all the members of QualifierSet.
 *
 * I am way too fed up with finding a simple and clean way to iterate through the members of an enum.
 * This is not scalable and I don't care.
 */
export const allQualifierSets = [QualifierSet.MastersA, QualifierSet.MastersB];
