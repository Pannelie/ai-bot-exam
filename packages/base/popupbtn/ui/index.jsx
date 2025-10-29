import { useState } from "react";
import "./index.css";
import { Chat } from "@csbot/chat";
import { Logo } from "@csbot/logo";

export const PopUpBtn = () => {
  const [open, setOpen] = useState(false);

  const toggleChat = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="popup-container">
      {open && <Chat />}
      <div className="popup-header">
        <button className={`pop-up-btn ${open ? "pop-up-btn--closed" : ""}`} onClick={toggleChat}>
          <span className="pop-up-btn__text">Behöver du hjälp?</span>
          <span className="pop-up-btn__icon">✕</span>
        </button>
        {!open && <Logo type="small" />}
      </div>
    </div>
  );
};
