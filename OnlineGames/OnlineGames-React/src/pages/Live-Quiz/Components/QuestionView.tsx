const colors = ["red", "blue", "green", "yellow"];

export default function QuestionView({ question, onAnswer }: any) {
  if (!question) return <div>Loading...</div>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        padding: 20,
        height: "100vh"
      }}
    >
      {question.answers?.map((a: any) => (
        <button
          key={a.id}
          onClick={() => onAnswer(a.id)}
          style={{
            backgroundColor: colors[a.index],
            border: "none",
            borderRadius: 20,
            fontSize: "2rem",
            color: "white",
            height: "100%",
          }}
        >
          {/* ❗ nincs text */}
        </button>
      ))}
    </div>
  );
}