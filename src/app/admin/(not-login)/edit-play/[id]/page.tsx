import { getCompetitions, getScore } from '@/queries';
import EditPlay from './edit-play';

const EditPlayPage = async ({ params }: { params: { id: string } }) => {
  const competitions = await getCompetitions();
  const score = await getScore(competitions?.[0].id, params.id);

  return <EditPlay competitions={competitions} score={score} />;
};

export default EditPlayPage;
