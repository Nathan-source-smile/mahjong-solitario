export const MESSAGE_TYPE = {
  // Messages from Server to Client
  SC_START_GAME: "SC_START_GAME",
  SC_DELETE_TILES: "SC_DELETE_TILES",
  SC_END_USER: "SC_END_USER",
  SC_END_GAME: "SC_END_GAME",

  // Messsages from Client to Server
  CS_COMPARE_TILES: "CS_COMPARE_TILES",
  CS_CLAIM_MOVE: "CS_CLAIM_MOVE",
  CS_RESTART_GAME: "CS_RESTART_GAME",
};

export const ROUNDS = {
  START_GAME: 0,
  START_STEP: 1,
  SELECT_UNIT: 2,
  MOVE_UNIT: 3,
};