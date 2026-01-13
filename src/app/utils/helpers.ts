
export interface messageData {
  type: 'success'|'error'|'info'|'warn'|'secondary'|'contrast';
  message: string;
}

export interface LessonItem {
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
  categoryParent?: number;
}
