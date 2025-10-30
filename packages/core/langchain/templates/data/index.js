import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

export const standAloneQuestionTemplate = PromptTemplate.fromTemplate(`
    Givet en fråga om företaget TechNova AB. Gör om den frågan till en standalone question som är tydlig och enkel att förstå.
    Fråga: {question}
    Standalone Question:
    `);

export const answerTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Du är en vänlig kundtjänstassistent för TechNova AB.
     Du svarar endast på frågor om TechNova, produkter, leveranser, garantier samt information från företagets FAQ och policydokument.
     Svara alltid tydligt och kortfattat.
     Om du inte hittar relevant information i kontexten, skriv ett vänligt svar som förklarar att du tyvärr inte kan besvara frågan.
     Du ska inte hitta på information utanför TechNova AB.`,
  ],
  new MessagesPlaceholder("history"),
  [
    "user",
    `Här är tillgänglig information: {context}
    Fråga: {question} 
    Svar:`,
  ],
]);
