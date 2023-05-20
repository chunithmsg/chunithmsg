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
