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
  memoryKey: "history",
  returnMessages: true,
  inputKey: "question",
});

const answerSchema = z.object({
  response: z.string().min(1),
  mainSource: z.string().nullable(),
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
  // (docs) => ({
  //   combinedText: docs.map((d) => d.pageContent).join("\n\n"),
  // }),
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
        context: result?.combinedText || "",
        question: data.originalQuestion?.question || "",
      };

      const llmOutput = await conversationChain.invoke(conversationInput);
      console.log("llmOutput:", llmOutput);

      if (!llmOutput.mainSource) llmOutput.mainSource = null;
      return llmOutput;
    } catch (err) {
      console.error("Fel i chain-steget:", err);
      console.trace(); // visar stacktrace
      return { response: "Ett fel uppstod", mainSource: null }; // fallback
    }
  },
]);
//     let parsedOutput;

//     try {
//       if (typeof llmOutput === "string") {
//         parsedOutput = JSON.parse(llmOutput);
//       } else if (typeof llmOutput?.response === "string") {
//         // 🚨 Här ligger den inbäddade JSON-strängen
//         parsedOutput = JSON.parse(llmOutput.response);
//       } else {
//         parsedOutput = llmOutput;
//       }
//     } catch (err) {
//       console.warn("Kunde inte parse AI-output:", err, llmOutput);
//       parsedOutput = { response: "Jag kunde inte läsa svaret korrekt.", mainSource: null };
//     }

//     if (typeof parsedOutput.mainSource === "undefined" && result.combinedText) {
//       const questionWords = data.originalQuestion.question
//         .toLowerCase()
//         .split(" ")
//         .filter((w) => w.length > 2);
//       const sentences = result.combinedText.split(/(?<=[.!?])\s+/);
//       const bestSentence = sentences.find((s) => questionWords.some((word) => s.toLowerCase().includes(word)));
//       parsedOutput.mainSource = bestSentence || null;
//     }

//     // 🧩 Fallback endast om undefined (inte null)
//     if (typeof parsedOutput.mainSource === "undefined") {
//       parsedOutput.mainSource = "Ingen relevant sektion hittades";
//     }

//     return {
//       response: parsedOutput.response,
//       mainSource: parsedOutput.mainSource,
//     };
//   },
// ]);
