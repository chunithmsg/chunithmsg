import dynamic from 'next/dynamic';

import { SongStatus, type SongStatusType } from '@/models/standing';
import { formatScore } from '@/libs';

const Badge = dynamic(() =>
  import('@/components/ui/badge').then((mod) => mod.Badge),
);

const SongScoreLabel = ({
  songScore: { score, ajFcStatus },
}: {
  // TODO: change any to a valid type after migrating to db
  songScore: { score: number; ajFcStatus: any };
  // songScore: { score: number; ajFcStatus: SongStatusType | null };
}) => (
  <div className="flex gap-2 align-middle">
    <span>{formatScore(score)}</span>
    {ajFcStatus === SongStatus.AJC && <Badge variant="gold">AJC</Badge>}
    {ajFcStatus === SongStatus.AJ && <Badge variant="gold">AJ</Badge>}
    {ajFcStatus === SongStatus.FC && <Badge variant="success">FC</Badge>}
  </div>
);

SongScoreLabel.displayName = 'songScoreLabel';

export default SongScoreLabel;