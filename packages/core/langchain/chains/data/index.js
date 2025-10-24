import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "../../../supabase/retriever/data";
import { standAloneQuestionTemplate } from "@csbot/templates";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "../../../utils";
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({
  memoryKey: "history",
  returnMessages: true,
  inputKey: "question",
});

//tar en array
const standAloneQuestionChain = RunnableSequence.from([
  standAloneQuestionTemplate, //hämtar min prompt för att få specifik fråga
  llm, //skickar den till min språkmodell, som producerar ett svar
  new StringOutputParser(), //plockar ut endast sträng
]);

const retrieverChain = RunnableSequence.from([
  (data) => {
    return data.standaloneQuestion;
  },
  retriever,
  combineDocuments,
]);

const conversationChain = new conversationChain({
  llm,
  prompt: answerTemplate,
  memory,
});

export const chain = RunnableSequence.from([
  {
    standaloneQuestion: standAloneQuestionChain,
    originalQuestion: new RunnablePassthrough(),
  },
  { context: retrieverChain, question: ({ originalQuestion }) => originalQuestion.question },
  conversationChain,
]);
