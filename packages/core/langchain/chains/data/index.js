import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "../../../supabase/retriever/data";
import { standAloneQuestionPrompt } from "@csbot/templates";
import { StringOutputParser } from "@langchain/core/output_parsers";

//tar en array
const standAloneQuestionChain = RunnableSequence.from([
  standAloneQuestionPrompt, //hämtar min prompt för att få specifik fråga
  llm, //skickar den till min språkmodell, som producerar ett svar
  new StringOutputParser(), //plockar ut endast sträng
]);

export const chain = RunnableSequence.from([
  {
    originalQuestion: new RunnablePassthrough(),
    standaloneQuestion: standAloneQuestionChain,
  },
  {},
]);
