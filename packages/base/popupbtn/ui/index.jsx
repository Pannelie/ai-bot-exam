import { useState } from "react";
import "./index.css";
import { Chat } from "@csbot/chat";
import { Logo } from "@csbot/logo";
import { useChatToggle } from "@csbot/usechattoggle";

export const PopUpBtn = () => {
  const { open, toggle } = useChatToggle();
  const [hover, setHover] = useState(false);

  return (
    <div className="popup-container">
      {open && <Chat />}
      <div className="popup-button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={toggle}>
        {!open && (
          <>
            <Logo type="popup" /> <div className={`tooltip-text ${hover ? "visible" : ""}`}>Behöver du hjälp?</div>{" "}
          </>
        )}
        {open && <button className={"close-btn"}>✕</button>}
      </div>
    </div>
  );
};
