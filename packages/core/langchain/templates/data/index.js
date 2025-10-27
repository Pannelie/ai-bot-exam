import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

export const standAloneQuestionTemplate = PromptTemplate.fromTemplate(`
    Givet en fråga om företaget TechNova AB. Gör om den frågan till en standalone question som är tydlig och enkel att förstå.
    Fråga: {question}
    Standalone Question:
    `);

export const answerTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Du är en hjälpsam assistent som vet allt om företaget TechNova AB. 
     Svara tydligt, korrekt och kortfattat på användarens fråga. 
     Om informationen inte finns i kontexten, säg att du inte vet.`,
  ],
  new MessagesPlaceholder("history"),
  [
    "user",
    `Kontext: {context}
    Fråga: {question} 
    Svar:`,
  ],
]);
