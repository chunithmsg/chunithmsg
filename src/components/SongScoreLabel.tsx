import dynamic from 'next/dynamic';

import type { SongScore } from '@/models/songScore';
import { formatScore } from '@/libs';

const Badge = dynamic(() =>
  import('@/components/ui/badge').then((mod) => mod.Badge),
);

const SongScoreLabel = ({
  songScore: { score, ajFcStatus },
}: {
  songScore: SongScore;
}) => (
  <div className="flex gap-2 align-middle">
    <span>{formatScore(score)}</span>
    {ajFcStatus === 'AJ' && <Badge variant="gold">AJ</Badge>}
    {ajFcStatus === 'FC' && <Badge variant="success">FC</Badge>}
  </div>
);

SongScoreLabel.displayName = 'songScoreLabel';

export default SongScoreLabel;
