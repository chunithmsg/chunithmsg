export type TeamDetails = {
  [teamId: string]: {
    teamName: string;
    members: {
      captain: string;
      player2: string;
      player3: string;
    };
  };
};
