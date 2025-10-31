import { useRef, useEffect, useMemo, useState } from "react";
import text from "../../../../src/assets/TechNovaFAQPolicydokument.txt?raw";
import "./index.css";
import { Header } from "@csbot/header";

export const FaqDropdown = ({ highlightSource }) => {
  const faqRef = useRef({});
  const [highlightedId, setHighlightedId] = useState({ sectionId: null, questionId: null });

  function parseFaqText(text) {
    const lines = text.split("\n");
    const faqData = [];
    let currentSection = null;
    let currentQuestion = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith("###")) {
        const title = line.replace(/^###\s*/, "");
        currentSection = { id: `section-${faqData.length}`, title, questions: [], info: [] };
        faqData.push(currentSection);
        currentQuestion = null;
      } else if (line.startsWith("-")) {
        const question = line.replace(/^-+\s*/, "");
        currentQuestion = {
          id: `q-${currentSection.questions.length}-${faqData.length}`,
          question,
          answer: [],
        };
        currentSection.questions.push(currentQuestion);
      } else if (currentQuestion) {
        currentQuestion.answer.push(line);
      } else if (currentSection) {
        currentSection.info.push(line);
      }
    }

    return faqData;
  }

  const faqData = useMemo(() => parseFaqText(text), []);

  // Funktion för att highlighta och scrolla till rätt fråga
  const highlightQuestion = (sourceTitle) => {
    if (!sourceTitle) return;

    const clean = (str) =>
      str
        .toLowerCase()
        .replace(/^\d+\s*/, "")
        .trim();

    // Stäng alla öppna details först
    Object.values(faqRef.current).forEach((el) => el && (el.open = false));

    // 1️⃣ Försök matcha sektionstitel (###)
    for (const section of faqData) {
      if (clean(section.title).includes(clean(sourceTitle))) {
        const sectionEl = faqRef.current[section.id];
        if (sectionEl) {
          sectionEl.open = true;
          setHighlightedId({ sectionId: section.id, questionId: null });
          setTimeout(() => {
            sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
          console.log("📘 Hittade sektion:", section.title);
        }
        return;
      }
    }

    // 2️⃣ Försök matcha fråga eller svar
    for (const section of faqData) {
      for (const q of section.questions) {
        const questionMatch = clean(q.question).includes(clean(sourceTitle));
        const answerMatch = q.answer.some((line) => clean(line).includes(clean(sourceTitle)));

        if (questionMatch || answerMatch) {
          const sectionEl = faqRef.current[section.id];
          const questionEl = faqRef.current[q.id];

          if (sectionEl) sectionEl.open = true;
          if (questionEl) questionEl.open = true;

          setTimeout(() => {
            questionEl?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);

          console.log(questionMatch ? "🎯 Hittade fråga:" : "💬 Hittade match i svar:", q.question);

          setHighlightedId({ sectionId: section.id, questionId: q.id });
          return;
        }
      }
    }

    console.warn("Ingen match hittades för:", sourceTitle);
  };

  useEffect(() => {
    highlightQuestion(highlightSource);
  }, [highlightSource, faqData]);

  return (
    <section className="faq">
      <Header title={"FAQ"} type={"small"} image={"logo"} />
      <section className="faq__wrapper">
        {faqData.map((section) => (
          <details
            key={section.id}
            ref={(el) => (faqRef.current[section.id] = el)}
            className={`faq__section ${highlightedId.sectionId === section.id ? "highlighted" : ""}`}
          >
            <summary className="faq__category">{section.title}</summary>

            {section.info.map((line, i) => (
              <p key={i} className="faq__info">
                {line}
              </p>
            ))}

            {section.questions.map((item) => (
              <details
                key={item.id}
                ref={(el) => (faqRef.current[item.id] = el)}
                className={`faq__details ${highlightedId.questionId === item.id ? "highlighted" : ""}`}
              >
                <summary className="faq__question">{item.question}</summary>
                <p className="faq__answer" style={{ whiteSpace: "pre-line" }}>
                  {item.answer.join("\n")}
                </p>
              </details>
            ))}
          </details>
        ))}
      </section>
    </section>
  );
};
