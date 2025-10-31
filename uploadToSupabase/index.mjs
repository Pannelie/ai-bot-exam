import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OllamaEmbeddings } from "@langchain/ollama";
import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
  const text = await readFile(`${process.cwd()}/TechNovaFAQPolicydokument.txt`, "utf-8");

  const sectionRegex = /\d+\.\s+.+?(?=\n\d+\.|$)/gs;
  const sections = text.match(sectionRegex);

  if (!sections) throw new Error("Inget avsnitt hittades i dokumentet");

  let allDocuments = [];

  for (let index = 0; index < sections.length; index++) {
    const sectionText = sections[index];

    // 2️⃣ Extrahera rubrik från första raden
    const titleMatch = sectionText.match(/^\d+\.\s+(.*)/);
    const title = titleMatch ? titleMatch[1] : "Ingen rubrik";

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ["\n\n", "\n", " "],
      chunkOverlap: 200,
    });

    // const splittedText = await textSplitter.createDocuments([text]);
    const chunks = await textSplitter.createDocuments([sectionText]);

    const chunksWithMetaData = chunks.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata, // behåll loc
        title: `Del ${index + 1} - ${title}`,
        anchorId: `faq-part-${index + 1}`,
        sectionNumber: index + 1,
      },
    }));

    allDocuments.push(...chunksWithMetaData);
  }

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  await SupabaseVectorStore.fromDocuments(allDocuments, new OllamaEmbeddings({ model: "llama3.1:8b" }), {
    client: supabaseClient,
    tableName: "documents",
  });

  console.log("Alla dokument uppladdade med metadata!", allDocuments);
} catch (error) {
  console.error(error);
}
