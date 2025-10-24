import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
export const standAloneQuestionTemplate = PromptTemplate.fromTemplate(`
    Givet en fråga om företaget TechNova AB. Gör om den frågan till en standalone question som är tydlig och enkel att förstå.
    Fråga: question
    Standalone Question:
    `);

export const answerTemplate = ChatPromptTemplate.fromMessages([
  ["system", `Du vet allt om företaget TechNova AB. Du är tydlig och`],
  new MessagesPlaceholder("history"),
  [
    "user",
    `Kontext: {context}
    Fråga: {question} 
    Svar:`,
  ],
]);
