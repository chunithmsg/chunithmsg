import { SongScore } from '@/models/songScore';
import { Badge } from '@/components/ui/badge';
import { formatScore } from '@/libs';

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
