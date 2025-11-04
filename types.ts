
export enum PostureStatus {
  GOOD = 'Good Posture',
  SLOUCHING = 'Slouching Detected',
  LEANING = 'Leaning Detected',
  UNKNOWN = 'Analyzing...',
}

export interface PostureDataPoint {
  time: string;
  status: 'good' | 'bad';
}
