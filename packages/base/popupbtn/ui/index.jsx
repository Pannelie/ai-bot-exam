import { useState } from "react";
import "./index.css";
import { Chat } from "@csbot/chat";
import { Logo } from "@csbot/logo";
import { useChatToggle } from "@csbot/usechattoggle";
import { DocSection } from "../../docsection/ui";
import { Switch } from "@csbot/switch";
import { FaqDropdown } from "@csbot/faqdropdown";

export const PopUpBtn = () => {
  const { open, toggle } = useChatToggle();
  const [hover, setHover] = useState(false);
  const [docData, setDocData] = useState(null);
  const [toggleSwitch, setToggleSwitch] = useState("chat");

  const handleSourceClick = (sourceTitle) => {
    setDocData(sourceTitle); // skickar source från AI-svaret
    setToggleSwitch("faq");
  };
  return (
    <div className="popup-container">
      {/* Allt relaterat till tidigare sökning försvinner om jag 
      renderar om komponenten, styrs bättre visuellt av css då */}
      {/* {open && <Chat />} */}
      <div className={`chat-wrapper ${open ? "visible" : "hidden"}`}>
        {toggleSwitch === "chat" ? <Chat onSourceClick={handleSourceClick} /> : <FaqDropdown highlightSource={docData} />}
        <Switch toggleSwitch={toggleSwitch} setToggleSwitch={setToggleSwitch} />
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
      {/* {docData && <DocSection docData={docData} />} */}
    </div>
  );
};
