import { SubmissionController } from "@/controllers/submissionController";
import {
  leaderboardFreezeEndTimestamp,
  leaderboardFreezeStartTimestamp,
} from "@/utils/constants";
import {
  getIndividualScoreStandings,
  getMastersStandings,
} from "@/utils/leaderboardUtils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const currentTimestamp = Date.now();
  const isLeaderboardFrozen =
    leaderboardFreezeStartTimestamp <= currentTimestamp &&
    currentTimestamp < leaderboardFreezeEndTimestamp;

  const submissionController = new SubmissionController();

  await submissionController.initialise();
  const submissionSet = await submissionController.getAllSubmissions(
    isLeaderboardFrozen
      ? { formSubmissionTimestampLimit: leaderboardFreezeStartTimestamp }
      : {}
  );

  return NextResponse.json({
    masters: getMastersStandings(submissionSet),
    individualSongStandings: getIndividualScoreStandings(submissionSet),
  });
};
