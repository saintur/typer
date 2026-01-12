export interface MessageData {
  type: 'success'|'error'|'info'|'warn'|'secondary'|'contrast';
  message: string;
}

export interface WallOfFame {
  username: string;
  wpm: string;
  accuracy: string;
}

export interface LevelItem {
  level: string;
  wpm: string;
}
