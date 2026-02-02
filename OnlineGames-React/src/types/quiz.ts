export type Quiz = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

export type QuizAnswer = {
  text: string;
  correct: boolean;
};

export type MatchingGroup = {
  id: string;
  left: string[];
  right: string[];
};

export type QuizQuestion = {
  id: string;
  type: "SINGLE" | "MULTI" | "MATCHING";
  question: string;

  answers?: QuizAnswer[];
  groups?: MatchingGroup[];
};
