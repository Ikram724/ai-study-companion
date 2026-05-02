export default function QuestionCard({ questions, answers, setAnswers }) {
  const setAns = (idx, val) => setAnswers({ ...answers, [idx]: val })

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div key={idx} className="bg-white rounded-xl border p-4">
          <p className="font-semibold">{idx + 1}. {q.question}</p>

          {q.type === "mcq" && (
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setAns(idx, opt)}
                  className={`text-left px-3 py-2 rounded border hover:bg-blue-50 ${
                    answers[idx] === opt ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {q.type === "true_false" && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setAns(idx, true)}
                className={`px-4 py-2 rounded border ${answers[idx] === true ? "bg-blue-600 text-white" : ""}`}
              >
                True
              </button>
              <button
                type="button"
                onClick={() => setAns(idx, false)}
                className={`px-4 py-2 rounded border ${answers[idx] === false ? "bg-blue-600 text-white" : ""}`}
              >
                False
              </button>
            </div>
          )}

          {q.type === "short" && (
            <textarea
              className="mt-3 w-full border rounded px-3 py-2"
              placeholder="Write your answer..."
              value={answers[idx] || ""}
              onChange={(e) => setAns(idx, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
