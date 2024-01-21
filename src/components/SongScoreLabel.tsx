import { CSSProperties } from 'react';

import { SongScore } from '@/models/songScore';
import { Badge } from '@/components/ui/badge';
import { formatScore } from '@/libs';

const SongScoreLabel = ({
  songScore: { score, ajFcStatus },
  fontWeight = 'normal',
  style,
}: {
  songScore: SongScore;
  fontWeight?: string;
  style?: CSSProperties;
}) => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', ...style }}>
    <div style={{ fontWeight }}>{formatScore(score)}</div>
    {ajFcStatus === 'AJ' && <Badge variant="secondary">AJ</Badge>}
    {ajFcStatus === 'FC' && <Badge variant="secondary">FC</Badge>}
  </div>
);

SongScoreLabel.displayName = 'songScoreLabel';

export default SongScoreLabel;
