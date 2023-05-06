import { SubmissionController } from "@/controllers/submissionController";
import {
  getChallengersStandings,
  getMastersStandings,
} from "@/utils/leaderboardUtils";
import { NextResponse } from "next/server";

export const GET = async () => {
  console.log("Submissions fetched at ", new Date());
  const submissionController = new SubmissionController();

  await submissionController.initialise();
  const submissionSet = await submissionController.getAllSubmissions();

  return NextResponse.json({
    masters: getMastersStandings(submissionSet),
    challengers: getChallengersStandings(submissionSet),
  });
};
