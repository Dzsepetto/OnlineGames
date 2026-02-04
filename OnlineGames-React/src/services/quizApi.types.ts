export type ApiAnswer = {
  ANSWER_TEXT: string;
  IS_CORRECT: number | string;
};

export type ApiGroup = {
  ID: string;
  LEFT: string[];
  RIGHT: string[];
};

export type ApiQuestion = {
  ID: string;
  QUESTION_TEXT: string;
  TYPE: "MULTIPLE_CHOICE" | "MATCHING";
  ANSWERS?: ApiAnswer[];
  GROUPS?: ApiGroup[];
};

export type ApiQuizResponse = {
  QUIZ: {
    ID: string;
    TITLE: string;
    DESCRIPTION: string | null;
    QUESTIONS: ApiQuestion[];
  };
};
