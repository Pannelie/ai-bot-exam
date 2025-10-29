import { useState } from "react";
import "./index.css";
import { Chat } from "@csbot/chat";

export const PopUpBtn = () => {
  const [open, setOpen] = useState(false);

  const toggleChat = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      {open && <Chat />}
      <button className="pop-up-btn" onClick={toggleChat}>
        Fråga mig
      </button>
    </>
  );
};
