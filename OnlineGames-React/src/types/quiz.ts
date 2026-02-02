export interface Quiz {
  id: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
}
