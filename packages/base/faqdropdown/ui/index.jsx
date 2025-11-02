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

  const highlightQuestion = (sourceTitle) => {
    if (!sourceTitle) return;

    // 🧩 Dela upp strängen på radbrytningar, punkt, frågetecken, utropstecken etc.
    const parts = sourceTitle
      .split(/[\n\r?.!]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    // Stäng alla öppna <details> först
    Object.values(faqRef.current).forEach((el) => el && (el.open = false));

    console.log("Söker efter delar:", parts);

    let matchedSection = null;
    let matchedQuestion = null;

    // 🔹 1. Leta efter sektionstitel som matchar någon del
    for (const section of faqData) {
      if (parts.some((p) => section.title.includes(p))) {
        matchedSection = section;
        console.log("Hittade sektion:", section.title);
        break;
      }
    }

    // 🔹 2. Leta efter fråga eller svar i hela FAQ:n
    for (const section of faqData) {
      for (const q of section.questions) {
        const questionMatch = parts.some((p) => q.question.includes(p));
        const answerMatch = q.answer.some((line) => parts.some((p) => line.includes(p)));

        if (questionMatch || answerMatch) {
          matchedQuestion = { section, question: q };
          console.log(questionMatch ? "Hittade fråga:" : "Hittade svar i:", q.question);
          break;
        }
      }
      if (matchedQuestion) break;
    }

    // 🔹 3. Öppna sektionen och ev. scrolla till fråga
    if (matchedSection) {
      const sectionEl = faqRef.current[matchedSection.id];
      if (sectionEl) {
        sectionEl.open = true;
        sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightedId({ sectionId: matchedSection.id, questionId: null });
      }
    }

    if (matchedQuestion) {
      const sectionEl = faqRef.current[matchedQuestion.section.id];
      const questionEl = faqRef.current[matchedQuestion.question.id];

      // Öppna sektion om den inte redan är öppen
      if (sectionEl) sectionEl.open = true;

      // Vänta en liten stund så sektionen hinner expandera innan scroll
      setTimeout(
        () => {
          if (questionEl) {
            questionEl.open = true;
            questionEl.scrollIntoView({ behavior: "smooth", block: "start" });
            setHighlightedId({
              sectionId: matchedQuestion.section.id,
              questionId: matchedQuestion.question.id,
            });
          }
        },
        matchedSection ? 400 : 100
      );
    }

    if (!matchedSection && !matchedQuestion) {
      console.warn("Ingen match hittades för:", sourceTitle);
    }
  };

  useEffect(() => {
    if (highlightSource) {
      highlightQuestion(highlightSource);
    } else {
      setHighlightedId({ sectionId: null, questionId: null });

      Object.values(faqRef.current).forEach((el) => {
        if (el) el.open = false;
      });
    }
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
