import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { client } from "@csbot/client";

//vektorer -> embeddings -> numerisk representation av text
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text:latest", //väljer model för omvandlingen
});

const vectorStore = new SupabaseVectorStore(
  embeddings, //själva modellen
  {
    client: client, //min supabase client
    tableName: "documents", //tabellen i Supabase där vektorerna lagras.
    queryName: "match_documents", //hämtar de mest relevanta dokumenten baserat på en query-vektor.
  }
);

//retrievern söker fram de mest relevanta dokumenten från vector store
// och skickar dem vidare till LLM:n.
export const retriever = vectorStore.asRetriever();
