import { useRef, useEffect, useMemo, useState } from "react";
import "./index.css";
import { Header } from "@csbot/header";
import { faqData, splitLines, findMatchingQuestion, findMatchingSection, openFaqElements } from "@csbot/faqutils";

export const FaqDropdown = ({ highlightSource }) => {
  const faqRef = useRef({});
  const [highlightedId, setHighlightedId] = useState({ sectionId: null, questionId: null });

  const highlightQuestion = (sourceTitle) => {
    if (!sourceTitle) return;
    const lines = splitLines(sourceTitle);
    let matchedQuestion = findMatchingQuestion(faqData, lines);
    //När en fråga hittas, bestämmer den sektionen automatiskt,
    // Om ingen fråga hittas, öppnas endast sektionen utan att någon fråga markeras.
    let matchedSection = matchedQuestion ? matchedQuestion.section : findMatchingSection(faqData, lines);

    openFaqElements(faqRef, matchedSection, matchedQuestion, setHighlightedId);
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
