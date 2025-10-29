import "./index.css";

export const Button = ({ type, text }) => {
  return (
    <button type={type} className="button">
      {text}
    </button>
  );
};
