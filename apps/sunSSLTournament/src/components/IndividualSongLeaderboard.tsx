// import Image from 'next/image';

// import { IndividualSongStanding } from '@/models/individualSongStanding';
// import type { SongId, SongWithJacket } from '@/libs';
// import {
//   songDetails,
//   filterIndividualScoreStandings,
//   formatOrdinal,
//   formatTimestamp,
//   isFinalist,
// } from '@/libs';
// import SongScoreLabel from './SongScoreLabel';

// export interface IndividualSongLeaderboardProps
//   extends React.ComponentProps<typeof Table> {
//   songs: SongWithJacket[];
//   standings: IndividualSongStanding[];
//   options?: {
//     shouldHideDisqualified?: boolean;
//     shouldHideFinalists?: boolean;
//   };
// }

// const LeaderboardTable = styled(Table<IndividualSongStanding>)`
//   .disqualified {
//     background-color: #ccc;
//   }
// `;

// const createColumnFromSong = ({
//   songId,
//   jacket,
// }: SongWithJacket):
//   | ColumnGroupType<IndividualSongStanding>
//   | ColumnType<IndividualSongStanding> => {
//   const { title } = songDetails[songId];

//   return {
//     title: (
//       <Image
//         src={jacket}
//         alt={title}
//         title={title}
//         style={{
//           maxHeight: '90px',
//           height: 'auto',
//           width: 'auto',
//         }}
//       />
//     ),
//     children: [
//       {
//         title: <div style={{ whiteSpace: 'pre-line' }}>{title}</div>,
//         key: songId,
//         dataIndex: ['scoreMap', songId],
//         render: (_text: string, record: IndividualSongStanding) => {
//           const individualSongScore = record.scoreMap[songId];
//           if (!individualSongScore) {
//             return null;
//           }

//           const {
//             timestamp,
//             ign,
//             leaderboardStanding,
//             songScore,
//             isDisqualified,
//           } = individualSongScore;

//           const isChallengersFinalist =
//             isFinalist(leaderboardStanding) &&
//             leaderboardStanding?.division === 'Challengers';

//           const isMastersFinalist =
//             isFinalist(leaderboardStanding) &&
//             leaderboardStanding?.division === 'Masters';

//           return (
//             <div
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 paddingLeft: '6px',
//                 paddingRight: '6px',
//                 paddingTop: '14px',
//                 paddingBottom: '14px',
//                 ...(isDisqualified && { background: '#ddd' }),
//                 ...(isMastersFinalist && { background: '#f0e9f5' }),
//                 ...(isChallengersFinalist && { background: '#f5f0f0' }),
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '4px',
//                 }}
//               >
//                 {ign}
//                 {leaderboardStanding && isFinalist(leaderboardStanding) && (
//                   <Tag
//                     color={
//                       leaderboardStanding.division === 'Challengers'
//                         ? 'red'
//                         : 'purple'
//                     }
//                   >{`${leaderboardStanding.division} ${formatOrdinal(
//                     leaderboardStanding.rank,
//                   )}`}</Tag>
//                 )}
//                 {isDisqualified && <Tag color="magenta">DQ</Tag>}
//               </div>
//               {formatTimestamp(timestamp)}
//               <SongScoreLabel songScore={songScore} fontWeight="bold" />
//             </div>
//           );
//         },
//       },
//     ],
//   };
// };

// const IndividualSongLeaderboard = ({
//   songs,
//   loading,
//   standings,
//   options,
// }: IndividualSongLeaderboardProps) => {
//   const columns: ColumnsType<IndividualSongStanding> = [
//     {
//       title: '#',
//       key: 'rank',
//       dataIndex: 'rank',
//       render: (_text: string, _record: IndividualSongStanding, idx: number) =>
//         idx + 1,
//     },
//     ...songs.map(createColumnFromSong),
//   ];

//   const filteredStandings = filterIndividualScoreStandings(standings, {
//     shouldFilterDisqualified: options?.shouldHideDisqualified,
//     shouldFilterFinalists: options?.shouldHideFinalists,
//   }).filter((standing) =>
//     songs.some(({ songId }) => standing.scoreMap[songId] !== undefined),
//   );

//   return (
//     <LeaderboardTable
//       size="small"
//       columns={columns}
//       pagination={false}
//       loading={loading}
//       dataSource={filteredStandings}
//       rowKey="key"
//       scroll={{ x: true }}
//     />
//   );
// };

// IndividualSongLeaderboard.displayName = 'individualSongLeaderboard';
// export default IndividualSongLeaderboard;
