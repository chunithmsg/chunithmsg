import { SongScore } from "@/models/songScore";
import { formatScore } from "@/utils/leaderboardFrontendUtils";
import { Tag } from "antd";

const SongScoreLabel = ({
  songScore: { score, ajFcStatus },
}: {
  songScore: SongScore;
}) => (
  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
    <p>{formatScore(score)}</p>
    {ajFcStatus == "AJ" && <Tag color="gold">AJ</Tag>}
    {ajFcStatus == "FC" && <Tag color="green">FC</Tag>}
  </div>
);

SongScoreLabel.displayName = "songScoreLabel";

export default SongScoreLabel;
