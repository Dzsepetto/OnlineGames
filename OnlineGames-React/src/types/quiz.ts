export type Quiz = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  creator_name?: string;
};

export type QuizAnswer = {
  text: string;
  correct: boolean;
};

export type MatchingPair = {
  left: string;
  rights: string[];
};

export type QuizQuestion = {
  id: string;
  type: "MULTIPLE_CHOICE" | "MATCHING";
  question: string;
  answers?: QuizAnswer[];
  pairs?: MatchingPair[];
};
