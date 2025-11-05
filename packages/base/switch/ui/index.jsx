import "./index.css";
//skicka med setSourceData till null för FAQ button
export const Switch = ({ toggleSwitch, setToggleSwitch, setSourceData }) => {
  return (
    <div className="switch">
      <button className={`switch__button ${toggleSwitch === "chat" ? "active" : ""}`} onClick={() => setToggleSwitch("chat")}>
        <span className="switch__text">Chat</span>
      </button>
      <button
        className={`switch__button ${toggleSwitch === "faq" ? "active" : ""}`}
        onClick={() => {
          setToggleSwitch("faq");
          setSourceData(null);
        }}
      >
        <span className="switch__text">FAQ</span>
      </button>
    </div>
  );
};
