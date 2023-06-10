import { SongScore } from "@/models/songScore";
import { formatScore } from "@/utils/leaderboardUtils";
import { Tag } from "antd";
import { CSSProperties } from "react";

const SongScoreLabel = ({
  songScore: { score, ajFcStatus },
  fontWeight = "normal",
  style,
}: {
  songScore: SongScore;
  fontWeight?: string;
  style?: CSSProperties;
}) => (
  <div style={{ display: "flex", gap: "8px", alignItems: "center", ...style }}>
    <div style={{ fontWeight }}>{formatScore(score)}</div>
    {ajFcStatus == "AJ" && <Tag color="gold">AJ</Tag>}
    {ajFcStatus == "FC" && <Tag color="green">FC</Tag>}
  </div>
);

SongScoreLabel.displayName = "songScoreLabel";

export default SongScoreLabel;
