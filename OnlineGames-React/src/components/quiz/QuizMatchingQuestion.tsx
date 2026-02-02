import { useMemo, useState } from "react";
import type { QuizQuestion } from "../../types/quiz";
import "../../styles/quiz.css"

type Card = {
  id: string;
  text: string;
  correctGroupId: string;
};

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const QuizMatchingQuestion = ({
  question,
  onAnswer,
}: {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}) => {
  const groups = question.groups ?? [];

  const columns = useMemo(() => {
    return groups.map((g) => ({
      id: g.id,
      header: g.left.length > 0 ? g.left[0] : "—",
    }));
  }, [question.id]);

  const initialBank = useMemo<Card[]>(() => {
    const cards: Card[] = [];
    for (const g of groups) {
      for (const r of g.right) {
        cards.push({
          id: `${g.id}::${r}`,
          text: r,
          correctGroupId: g.id,
        });
      }
    }
    return shuffle(cards);
  }, [question.id]);

  const [bank, setBank] = useState<Card[]>(initialBank);
  const [placed, setPlaced] = useState<Record<string, Card[]>>({});
  const [dragId, setDragId] = useState<string | null>(null);

  if (groups.length === 0 || columns.length === 0) {
    return (
      <div className="quiz-question">
        <h3>{question.question}</h3>
        <div>No matching groups found.</div>
      </div>
    );
  }

  const findCard = (id: string): Card | null => {
    const inBank = bank.find((c) => c.id === id);
    if (inBank) return inBank;

    for (const gid of Object.keys(placed)) {
      const c = (placed[gid] ?? []).find((x) => x.id === id);
      if (c) return c;
    }
    return null;
  };

  const removeCardEverywhere = (id: string) => {
    setBank((b) => b.filter((c) => c.id !== id));
    setPlaced((p) => {
      const next: Record<string, Card[]> = {};
      for (const gid of Object.keys(p)) {
        next[gid] = (p[gid] ?? []).filter((c) => c.id !== id);
      }
      return next;
    });
  };

  const dropToGroup = (groupId: string) => {
    if (!dragId) return;
    const card = findCard(dragId);
    if (!card) return;

    removeCardEverywhere(dragId);
    setPlaced((p) => ({
      ...p,
      [groupId]: [...(p[groupId] ?? []), card],
    }));
    setDragId(null);
  };

  const dropToBank = () => {
    if (!dragId) return;
    const card = findCard(dragId);
    if (!card) return;

    removeCardEverywhere(dragId);
    setBank((b) => [...b, card]);
    setDragId(null);
  };

  const totalCards = initialBank.length;
  const placedCount = Object.values(placed).reduce(
    (acc, arr) => acc + (arr?.length ?? 0),
    0
  );
  const allPlaced = placedCount === totalCards;

  const submit = () => {
    if (!allPlaced) return;

    const correct = Object.entries(placed).every(([gid, cards]) =>
      (cards ?? []).every((c) => c.correctGroupId === gid)
    );

    onAnswer(correct);
  };

  return (
    <div className="quiz-question">
      <h3>{question.question}</h3>

      <div
        className="matching-grid"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(180px, 1fr))`,
        }}
      >
        {columns.map((col) => (
          <div key={col.id} className="matching-col">
            <div className="matching-head">{col.header}</div>

            <div
              className={`matching-dropzone ${dragId ? "is-dragging" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropToGroup(col.id)}
            >
              {(placed[col.id] ?? []).map((card) => (
                <div
                  key={card.id}
                  className="matching-card"
                  draggable
                  onDragStart={() => setDragId(card.id)}
                  onDragEnd={() => setDragId(null)}
                >
                  {card.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="matching-bank-wrap">
        <div className="matching-bank-title">Válaszok</div>

        <div
          className="matching-bank"
          onDragOver={(e) => e.preventDefault()}
          onDrop={dropToBank}
        >
          {bank.map((card) => (
            <div
              key={card.id}
              className="matching-card"
              draggable
              onDragStart={() => setDragId(card.id)}
              onDragEnd={() => setDragId(null)}
            >
              {card.text}
            </div>
          ))}
        </div>
      </div>

      <button className="matching-submit" disabled={!allPlaced} onClick={submit}>
        Ellenőrzés
      </button>
    </div>
  );
};

export default QuizMatchingQuestion;
