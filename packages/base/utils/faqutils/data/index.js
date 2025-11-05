import text from "../../../../../src/assets/TechNovaFAQPolicydokument.txt?raw";

const parseFaqText = (text) => {
  const lines = text.split("\n");
  const faqData = [];
  let currentSection = null;
  let currentQuestion = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue; //är raden tom, så hoppa över tack

    //börjar det med ### så är det en rubrik
    if (line.startsWith("###")) {
      const title = line.replace(/^###\s*/, "");
      currentSection = { id: `section-${faqData.length}`, title, questions: [], info: [] };
      faqData.push(currentSection);
      currentQuestion = null;
      //question sätts till null eftersom jag precis angivit en ny rubrik

      //börjar det med - så är det en question
    } else if (line.startsWith("-")) {
      const question = line.replace(/^-+\s*/, "");
      currentQuestion = {
        id: `q-${currentSection.questions.length}-${faqData.length}`,
        question,
        answer: [],
      };
      currentSection.questions.push(currentQuestion);
      //om den inte börjar med (###) eller (-) men det redan existerar en question så är det ett answer
    } else if (currentQuestion) {
      currentQuestion.answer.push(line);
      //om det inte heller existerar en question så är det brödtext -info
    } else if (currentSection) {
      currentSection.info.push(line);
    }
  }

  return faqData;
};

export const faqData = parseFaqText(text);

//gör texten lättare att jämföra rad för rad utan mellanslag eller tomma rader.
// "" blir false i min boolean, så det tas då bort
export const splitLines = (text) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

//------------------------logik för öppning av rätt fråga----------------------
export const findMatchingQuestion = (faqData, lines) => {
  for (const section of faqData) {
    for (const q of section.questions) {
      for (const line of lines) {
        if (q.question === line || q.answer.includes(line)) {
          console.log("Hittade matchande question: ", q.question);
          {
            q.answer && console.log("matchande svar: ", q.answer);
          }
          return { section, question: q };
        }
      }
    }
  }
  return null;
};

//------------------logik för öppning av rätt section om det ej hittades i findMatchingQuestion----------------------

export const findMatchingSection = (faqData, lines) => {
  for (const section of faqData) {
    for (const line of lines) {
      if (section.title.includes(line)) {
        console.log("Hittade enbart matchande section: ", section.title);
        return section;
      }
    }
  }
  return null;
};

//------------------------logik för öppning av rät section och fråga----------------------
export const openFaqElements = (faqRef, matchedSection, matchedQuestion, setHighlightedId) => {
  // Stäng alla till en början, så inget annat råkar vara öppet smatidigt
  Object.values(faqRef.current).forEach((el) => el && (el.open = false));

  // om det finns matchedSection, öppna den och scrolla in till view
  if (matchedSection) {
    const sectionEl = faqRef.current[matchedSection.id];
    if (sectionEl) {
      sectionEl.open = true;
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightedId({ sectionId: matchedSection.id, questionId: null });
    }
  }

  // om det finns matchedQuestion, öppna frågan och scrolla in till view
  if (matchedQuestion) {
    const questionEl = faqRef.current[matchedQuestion.question.id];
    if (questionEl) {
      setTimeout(
        () => {
          questionEl.open = true;
          questionEl.scrollIntoView({ behavior: "smooth", block: "start" });
          setHighlightedId({
            sectionId: matchedQuestion.section.id,
            questionId: matchedQuestion.question.id,
          });
        },
        //väntar in rendering beroende på om matchedSection redan var öppen el. inte
        matchedSection ? 400 : 100
      );
    }
  }
  //om inget matchas så har allt inom faqRef stängts
};
