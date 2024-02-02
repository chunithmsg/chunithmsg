import { getCompetitions } from '@/queries';
import NewPlay from './new-play';

const NewPlayPage = async () => {
  const competitions = await getCompetitions();

  return <NewPlay competitions={competitions} />;
};

export default NewPlayPage;
