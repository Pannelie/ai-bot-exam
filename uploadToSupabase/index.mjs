import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OllamaEmbeddings } from "@langchain/ollama";
import "dotenv/config";

//går igenom varje fil och skriver bara ut pageContent värdet (min textbit följt av två radbryt och sen nästa textbit )
const combineDocuments = (docs) => {
  return docs.map((doc) => doc.pageContent).join("\n\n");
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
  const text = await readFile(`${process.cwd()}/TechNovaFAQPolicydokument.txt`, "utf-8");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " "],
    chunkOverlap: 200,
  });

  const splittedText = await textSplitter.createDocuments([text]);

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  await SupabaseVectorStore.fromDocuments(splittedText, new OllamaEmbeddings({ model: "llama3.1:8b" }), {
    client: supabaseClient,
    tableName: "documents",
  });

  console.log("splittedText: ", splittedText);
} catch (error) {
  console.error(error);
}
