import { SongScore } from "@/models/songScore";
import { formatScore } from "@/utils/leaderboardUtils";
import { Tag } from "antd";

const SongScoreLabel = ({
  songScore: { score, ajFcStatus },
  fontWeight = "normal",
}: {
  songScore: SongScore;
  fontWeight?: string;
}) => (
  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
    <p style={{ fontWeight }}>{formatScore(score)}</p>
    {ajFcStatus == "AJ" && <Tag color="gold">AJ</Tag>}
    {ajFcStatus == "FC" && <Tag color="green">FC</Tag>}
  </div>
);

SongScoreLabel.displayName = "songScoreLabel";

export default SongScoreLabel;
