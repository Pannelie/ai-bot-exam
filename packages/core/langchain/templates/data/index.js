import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
export const standAloneQuestionPrompt = PromptTemplate.fromTemplate(`
    Givet en fråga om företaget TechNova AB. Gör om den frågan till en standalone question som är tydlig och enkel att förstå.
    Fråga: question
    Standalone Question:
    `);
