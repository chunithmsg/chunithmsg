import { SubmissionController } from "@/controllers/submissionController";
import {
  getChallengersStandings,
  getIndividualScoreStandings,
  getMastersStandings,
} from "@/utils/leaderboardUtils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const submissionController = new SubmissionController();

  await submissionController.initialise();
  const submissionSet = await submissionController.getAllSubmissions();

  return NextResponse.json({
    masters: getMastersStandings(submissionSet),
    challengers: getChallengersStandings(submissionSet),
    individualSongStandings: getIndividualScoreStandings(submissionSet),
  });
};
