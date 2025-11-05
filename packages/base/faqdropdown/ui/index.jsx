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

//Hämtar in min text och formatterar till min FAQ section utifrån hur min.txt är stylad. t.ex. ### Vid rubrik
// function parseFaqText(text) {
//   const lines = text.split("\n");
//   const faqData = [];
//   let currentSection = null;
//   let currentQuestion = null;

//   for (let line of lines) {
//     line = line.trim();
//     if (!line) continue;

//     if (line.startsWith("###")) {
//       const title = line.replace(/^###\s*/, "");
//       currentSection = { id: `section-${faqData.length}`, title, questions: [], info: [] };
//       faqData.push(currentSection);
//       currentQuestion = null;
//     } else if (line.startsWith("-")) {
//       const question = line.replace(/^-+\s*/, "");
//       currentQuestion = {
//         id: `q-${currentSection.questions.length}-${faqData.length}`,
//         question,
//         answer: [],
//       };
//       currentSection.questions.push(currentQuestion);
//     } else if (currentQuestion) {
//       currentQuestion.answer.push(line);
//     } else if (currentSection) {
//       currentSection.info.push(line);
//     }
//   }

//   return faqData;
// }

// const faqData = useMemo(() => parseFaqText(text), []);

// const highlightQuestion = (sourceTitle) => {
//   if (!sourceTitle) return;

//   // 1️⃣ Dela upp sourceTitle i separata rader, trimma och filtrera bort tomma
//   const lines = sourceTitle
//     .split("\n")
//     .map((l) => l.trim())
//     .filter(Boolean);

//   // 2️⃣ Stäng alla öppna <details> först
//   Object.values(faqRef.current).forEach((el) => el && (el.open = false));

//   let matchedSection = null;
//   let matchedQuestion = null;

//   // 3️⃣ Försök först matcha exakt fråga eller svar
//   outerLoop: for (const section of faqData) {
//     for (const q of section.questions) {
//       for (const line of lines) {
//         const normalizedLine = line.toLowerCase().replace(/[?.!]/g, "").trim();
//         const normalizedQuestion = q.question.toLowerCase().replace(/[?.!]/g, "").trim();
//         const normalizedAnswerLines = q.answer.map((a) => a.toLowerCase().replace(/[?.!]/g, "").trim());

//         if (normalizedQuestion === normalizedLine || normalizedAnswerLines.includes(normalizedLine)) {
//           matchedQuestion = { section, question: q };
//           matchedSection = section;
//           break outerLoop;
//         }
//       }
//     }
//   }

//   // 4️⃣ Om ingen fråga hittades, matcha bara sektionen
//   if (!matchedQuestion) {
//     for (const section of faqData) {
//       for (const line of lines) {
//         const normalizedLine = line.toLowerCase().replace(/[?.!]/g, "").trim();
//         const normalizedSection = section.title.toLowerCase().replace(/[?.!]/g, "").trim();

//         if (normalizedSection.includes(normalizedLine)) {
//           matchedSection = section;
//           break;
//         }
//       }
//       if (matchedSection) break;
//     }
//   }

//   // 5️⃣ Öppna sektion
//   if (matchedSection) {
//     const sectionEl = faqRef.current[matchedSection.id];
//     if (sectionEl) {
//       sectionEl.open = true;
//       sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
//       setHighlightedId({ sectionId: matchedSection.id, questionId: null });
//     }
//   }

//   // 6️⃣ Öppna fråga om match hittades
//   if (matchedQuestion) {
//     const questionEl = faqRef.current[matchedQuestion.question.id];
//     if (questionEl) {
//       // Vänta lite så att sektionen hinner expandera
//       setTimeout(
//         () => {
//           questionEl.open = true;
//           questionEl.scrollIntoView({ behavior: "smooth", block: "start" });
//           setHighlightedId({
//             sectionId: matchedQuestion.section.id,
//             questionId: matchedQuestion.question.id,
//           });
//         },
//         matchedSection ? 400 : 100
//       );
//     }
//   }

//   if (!matchedSection && !matchedQuestion) {
//     console.warn("Ingen match hittades för:", sourceTitle);
//   }
// };
