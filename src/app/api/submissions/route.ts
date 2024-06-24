import { NextResponse } from 'next/server';

import { SubmissionController } from '@/controllers/submissionController';
import {
  // leaderboardFreezeEndTimestamp,
  // leaderboardFreezeStartTimestamp,
  getIndividualScoreStandings,
  getQualifierStandings,
} from '@/libs';

export const GET = async () => {
  // const currentTimestamp = Date.now();
  // const isLeaderboardFrozen =
  //   leaderboardFreezeStartTimestamp <= currentTimestamp &&
  //   currentTimestamp < leaderboardFreezeEndTimestamp;

  const submissionController = new SubmissionController();

  await submissionController.initialise();
  const submissionSet = await submissionController
    .getAllSubmissions
    // isLeaderboardFrozen
    //   ? { formSubmissionTimestampLimit: leaderboardFreezeStartTimestamp }
    //   : {},
    ();

  const qualifierStandings = getQualifierStandings(submissionSet);
  const individualSongStandings = getIndividualScoreStandings(submissionSet);

  // console.log(qualifierStandings);
  // console.log(individualSongStandings);

  return NextResponse.json({
    qualifiers: qualifierStandings,
    individualSongStandings,
  });
};
