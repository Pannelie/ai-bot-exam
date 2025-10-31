import "./index.css";

export const Switch = ({ toggleSwitch, setToggleSwitch }) => {
  return (
    <div className="switch">
      <button className={`switch__button ${toggleSwitch === "chat" ? "active" : ""}`} onClick={() => setToggleSwitch("chat")}>
        <span className="switch__text">Chat</span>
      </button>
      <button className={`switch__button ${toggleSwitch === "faq" ? "active" : ""}`} onClick={() => setToggleSwitch("faq")}>
        <span className="switch__text">FAQ</span>
      </button>
    </div>
  );
};
