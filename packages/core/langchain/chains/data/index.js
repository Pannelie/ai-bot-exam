import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "../../../supabase/retriever/data";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { combineDocuments } from "../../../utils";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { llm } from "@csbot/llm";
import { standAloneQuestionTemplate, answerTemplate } from "@csbot/templates";
import { z } from "zod";

const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
  inputKey: "question",
});

const answerSchema = z.object({
  response: z.union([
    z.string().min(1),
    z.object({
      response: z.string().min(1),
      mainSource: z.string().nullable(),
    }),
  ]),
  mainSource: z.string().nullable().optional(),
});

//tar en array
const standAloneQuestionChain = RunnableSequence.from([
  standAloneQuestionTemplate, //hämtar min prompt för att få specifik fråga
  llm, //skickar den till min språkmodell, som producerar ett svar
  (output) => {
    return output; // output är AIMessage, StringOutputParser tar hand om texten
  },
  new StringOutputParser(), //plockar ut endast sträng
]);

const retrieverChain = RunnableSequence.from([
  (data) => data.standaloneQuestion,
  async (question) => await retriever.invoke(question),
  (docs) => {
    const combinedText = docs.map((doc) => doc.pageContent).join("\n\n");
    console.log("Context: ", combinedText);
    return {
      combinedText,
    };
  },
]);

const answerParser = StructuredOutputParser.fromZodSchema(answerSchema);

const conversationChain = new ConversationChain({
  llm,
  prompt: answerTemplate,
  memory,
  outputParser: answerParser,
});

export const chain = RunnableSequence.from([
  {
    standaloneQuestion: standAloneQuestionChain,
    originalQuestion: new RunnablePassthrough(),
  },
  async (data) => {
    try {
      const result = await retrieverChain.invoke(data);
      console.log("Retriever result:", result);

      const conversationInput = {
        question: data.originalQuestion?.question || "",
        context: result?.combinedText || "",
      };

      console.log("Historik innan LLM:", memory.chatHistory);
      const llmOutput = await conversationChain.invoke(conversationInput);
      console.log("Historik efter LLM:", memory.chatHistory);
      console.log("LLM raw output:", llmOutput);

      // if (!llmOutput.mainSource) llmOutput.mainSource = null;
      console.log("LLM raw output with mainsource:", llmOutput);
      return llmOutput;
    } catch (err) {
      console.error("Fel i chain-steget:", err);
      console.trace(); // visar stacktrace
      return { response: "Ett fel uppstod", mainSource: null }; // fallback
    }
  },
]);
