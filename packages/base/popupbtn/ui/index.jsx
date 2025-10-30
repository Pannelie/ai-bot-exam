import { useState } from "react";
import "./index.css";
import { Chat } from "@csbot/chat";
import { Logo } from "@csbot/logo";
import { useChatToggle } from "@csbot/usechattoggle";
import { DocSection } from "../../docsection/ui";

export const PopUpBtn = () => {
  const { open, toggle } = useChatToggle();
  const [hover, setHover] = useState(false);
  const [docData, setDocData] = useState(null);

  const handleSourceClick = (source) => {
    setDocData(source); // skickar source från AI-svaret
  };
  return (
    <div className="popup-container">
      {/* Allt relaterat till tidigare sökning försvinner om jag 
      renderar om komponenten, styrs bättre visuellt av css då */}
      {/* {open && <Chat />} */}
      <div className={`chat-wrapper ${open ? "visible" : "hidden"}`}>
        <Chat onSourceClick={handleSourceClick} />
      </div>
      <div className="popup-button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={toggle}>
        {!open && (
          <>
            <Logo type="popup" aria-label="Öppna chatt för hjälp" aria-describedby="tooltip-chat" />{" "}
            <div id="tooltip-chat" className={`tooltip-text ${hover ? "visible" : ""}`}>
              Behöver du hjälp?
            </div>
          </>
        )}
        {open && (
          <button className={"close-btn close-btn--below"} title="Stäng chattfönster" aria-label="Stäng chatt">
            ✕
          </button>
        )}
      </div>
      {docData && <DocSection docData={docData} />}
    </div>
  );
};
