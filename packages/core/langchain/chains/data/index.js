import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

import { combineDocuments } from "@csbot/combinedocuments";
import { retriever } from "@csbot/retriever";
import { answerParser } from "@csbot/parsers";
import { llm } from "@csbot/llm";
import { standAloneQuestionTemplate, answerTemplate } from "@csbot/templates";

const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
  inputKey: "question",
});

const standAloneQuestionChain = RunnableSequence.from([
  standAloneQuestionTemplate, //hämtar min prompt för att få specifik fråga
  llm, //skickar den till min språkmodell, som producerar ett svar
  new StringOutputParser(), //plockar ut endast sträng
]);

const retrieverChain = RunnableSequence.from([(data) => data.standaloneQuestion, retriever, combineDocuments]);

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
  async (data) => {
    const result = await retrieverChain.invoke(data);
    console.log("Retriever result:", result);

    const conversationInput = {
      question: data.originalQuestion?.question || "",
      context: result || "",
    };

    const llmOutput = await conversationChain.invoke(conversationInput);
    console.log("Historik efter LLM:", memory.chatHistory);

    console.log("LLM raw output:", llmOutput);
    return answerParser.parse(llmOutput.response);
  },
]).withFallbacks(() => ({ response: "Oj, något gick fel. Försök igen senare.", mainSource: null }));

//.withFallbacks. källor:
//  https://www.js-craft.io/blog/fallbacks-langchain-javascript/
// https://v03.api.js.langchain.com/classes/_langchain_core.runnables.RunnableWithFallbacks.html
// samt vs code egna "popup info
