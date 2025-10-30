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
    return output; // output är AIMessage, StringOutputParser tar hand om texten
  },
  new StringOutputParser(), //plockar ut endast sträng
]);

const retrieverChain = RunnableSequence.from([
  (data) => {
    console.log("StandaloneQuestion", data);
    return data.standaloneQuestion;
  },
  async (question) => {
    const docs = await retriever.invoke(question);
    // OBS: om du använder SupabaseVectorStore kan du istället köra similaritySearch
    return docs;
  },
  (docs) => {
    const combinedText = docs.map((doc) => doc.pageContent).join("\n\n");
    const sources = docs.map((doc) => ({
      title: doc.metadata.title || "Okänd källa",
      anchorId: doc.metadata.anchorId || doc.metadata.id || "",
    }));
    return { combinedText, sources };
  },
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
  async (data) => {
    // Hämta relevanta dokument
    const result = await retrieverChain.invoke(data);

    // Skicka endast texten till ConversationChain
    const conversationInput = {
      context: result?.combinedText || "",
      question: data.originalQuestion.question,
    };

    const llmOutput = await conversationChain.invoke(conversationInput);

    return {
      response: llmOutput.response,
      sources: result.sources || [],
    };
  },
]);
