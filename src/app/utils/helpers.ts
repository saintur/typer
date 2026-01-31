export interface UpgradePlan {
  code: string;
  name: string;
  durationMonth?: number; // жил, 99 = lifetime
  price: number;
  featured: boolean;
  conditions: string[];
  paymentNote: string;
}

export interface TrackedActivity {
  id: number;
  data: string;
  exerciseId: number;
}

export interface MessageData {
  type: 'success'|'error'|'info'|'warn'|'secondary'|'contrast';
  message: string;
}

export interface User {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  birthday: string,
  gender: string;
  measureSpeed: string;
  enableSounds: boolean;
  keyboardType: string;
  sentenceSpaces: number;
  role: string;
}

export interface UserUpgrade {
  active: boolean;
  durationMonth: number;
  planName: string;
  expireAt: Date | null;
}

export interface ExerciseItem {
  id: number;
  mnTitle: string;
  enTitle: string;
  mnHelpText: string;
  enHelpText: string;
  slug: string;
  sortnum: number;
  next: number;
  prev: number;
  text: string;
  maxTime: number; // change to timeLimit
  minAccuracy: number;
  minSpeed: number;
}

export interface ProgressItem {
  typedChars: number;
  correctChars: number;
  timeSeconds: number;
  compledtedCount: number;
  completionPercent: number;
}

export type LessonItem = {
  id: number;
  mnTitle: string;
  enTitle: string;
  slug: string;
  sortnum: number;
  isPremium: boolean;
  categoryType: string;
  mnIntro: string;
  enIntro: string;
  mnCongrats: string;
  enCongrats: string;
  categoryParentId?: number;
  categoryParentName?: string;
  progress?: ProgressItem| null;
}

export enum TextHelper {
  EXERCISE_FAILURE= "Oops! Exercise Requirements Not Reached.",
  FAILURE_ACCURACY= "You must score at least a 0% accuracy to continue.",
  FAILURE_SPEED="You must type at least 0 1 to continue.",
  FAILURE_TIME="You must complete the exercise in under 0 seconds to continue.",
  BACK_TO_COURSES='Back to Courses',
  BEGIN_LESSON='BEGIN LESSON',
  BEGINNER_COURSE='Beginner Course',
  CONTINUE_LESSON='CONTINUE LESSON',
  TIMED_OUT_TEXT= "Your session has timed out.  Please log back in.",
  EXERCISE_ACCURACY="Exercise Accuracy",
  EXERCISE_COMPLETE="Exercise Complete!",
  LOADING_LESSON="Loading Lesson Content",
  NET_SPEED="Net Speed",
  PRESS_ENTER="press enter or space",
  RETAKE_EXERCISE="retake exercise",
  RETURN_TO_COURSES="RETURN TO COURSES",
  SAVE_AND_CONTINUE="SAVE & CONTINUE",
  SHOW_HIDE_HANDS="Show\/Hide Keyboard Diagram",
}

export type FinishedData = {
  typedChars: number,
  correctChars: number,
  timeSeconds: number
  missedKeys: Record<string, number>,
  accuracy: number,
}

export interface TypingStats {
  typedChars: number;
  correctChars: number;
  timeSeconds: number;
  speedType: string;
}

export interface TypingResult {
  gross: number;
  net: number;
  accuracy: number;
}

export function calculateTypingStats(
    stats: TypingStats
): TypingResult {

  const { typedChars, correctChars, timeSeconds, speedType } = stats;

  if (typedChars <= 0 || timeSeconds <= 0) {
    return {
      gross: 0,
      net: 0,
      accuracy: 0,
    };
  }
  //speedType = 'WPM'|'KPM'
  const minutes = timeSeconds / 60;

  // Gross speeds
  const grossWPM = (typedChars / 5) / minutes;
  const grossKPM = typedChars / minutes;

  // Accuracy
  const accuracy = (correctChars / typedChars) * 100;

  // Net speeds
  const netWPM = (correctChars / 5) / minutes;
  const netKPM = grossKPM * (accuracy / 100);

  return {
    gross: speedType == 'KPM' ? Number(grossKPM.toFixed(0)) : Number(grossWPM.toFixed(1)),
    net: speedType == 'KPM' ? Number(netKPM.toFixed(0)) : Number(netWPM.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
  };
}
