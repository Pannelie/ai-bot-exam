import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "../../../supabase/retriever/data";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "../../../utils";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { llm } from "@csbot/llm";
import { standAloneQuestionTemplate, answerTemplate } from "@csbot/templates";

const memory = new BufferMemory({
  memoryKey: "history",
  returnMessages: true,
  inputKey: "question",
});

//tar en array
const standAloneQuestionChain = RunnableSequence.from([
  standAloneQuestionTemplate, //hämtar min prompt för att få specifik fråga
  llm, //skickar den till min språkmodell, som producerar ett svar
  (output) => {
    console.log("Efter LLM (standaloneQuestion):", output);
    return output; // output är AIMessage, StringOutputParser tar hand om texten
  },
  new StringOutputParser(), //plockar ut endast sträng
]);

const retrieverChain = RunnableSequence.from([
  (data) => {
    console.log("Data till retrieverChain:", data);
    return data.standaloneQuestion;
  },
  retriever,
  (output) => {
    console.log("Efter retriever:", output);
    return output;
  },
  combineDocuments,
  (output) => {
    console.log("Efter combineDocuments:", output);
    return output;
  },
]);

const conversationChain = new ConversationChain({
  llm,
  prompt: answerTemplate,
  memory,
});

export const chain = RunnableSequence.from([
  {
    standaloneQuestion: standAloneQuestionChain,
    originalQuestion: new RunnablePassthrough(),
  },
  {
    context: retrieverChain,
    question: ({ originalQuestion }) => {
      console.log("originalQuestion:", originalQuestion);
      return originalQuestion.question;
    },
  },
  (output) => {
    console.log("Innan conversationChain:", output);
    return output;
  },
  conversationChain,
  (output) => {
    console.log("Slutresultat (conversationChain):", output);
    return output;
  },
]);
