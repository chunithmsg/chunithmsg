import { SubmissionController } from '@/controllers/submissionController';
import { getQualifierStandings } from '@/libs';

export const getLeaderboard = async () => {
  const submissionController = new SubmissionController();

  await submissionController.initialise();
  const submissionSet = await submissionController.getAllSubmissions();

  return getQualifierStandings(submissionSet);
};
