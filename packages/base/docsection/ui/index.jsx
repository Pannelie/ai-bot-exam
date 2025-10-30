import "./index.css";
import { useState, useEffect } from "react";
import faqText from "../../../../uploadToSupabase/TechNovaFAQPolicydokument.txt?raw";
import { FaqDropdown } from "@csbot/faqdropdown";
import { client } from "@csbot/client"; // eller var du initierat supabase

export const DocSection = ({ docData }) => {
  const [content, setContent] = useState("");

  console.log("docData:", docData);
  console.log("anchorId:", docData.anchorId);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!docData?.anchorId) return;
      const { data, error } = await client.from("documents").select("content").eq("metadata->>anchorId", docData.anchorId).single();

      console.log("data: ", data);
      if (error) return console.error(error);
      setContent(data.content);

      // scrolla till rätt sektion
      setTimeout(() => {
        const element = document.getElementById(docData.anchorId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };
    fetchDocument();
  }, [docData]);

  return (
    <section className="doc-tab">
      <h3>{docData.title}</h3>
      <div className="doc-content">{content || "Laddar innehåll..."}</div>
      <FaqDropdown txtContent={faqText} />
    </section>
  );
};
