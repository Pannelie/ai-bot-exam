import { useState } from "react";
import "./index.css";

export const FaqDropdown = ({ txtContent }) => {
  // Dela upp texten i sektioner baserat på nummer + punkt (1., 2., 3. osv)
  const sections = txtContent
    .split(/\n(?=\d+\.\s)/) // splitter på rad som börjar med nummer + punkt
    .map((section) => {
      const lines = section.split("\n");
      const subtitle = lines[0].replace(/\d+\.\s/, ""); // tar bort numret från rubriken
      const paragraph = lines.slice(1).join("\n").trim(); // resten blir innehåll
      return { subtitle, paragraph };
    });

  return (
    <div className="faq-container">
      {sections.map((content, index) => (
        <details className="faq__details" key={index}>
          <summary className="faq__summary-title">{content.subtitle}</summary>
          <div className="faq__paragraph">
            {content.paragraph.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
};
