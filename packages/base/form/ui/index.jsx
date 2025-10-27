import { Button } from "@csbot/button";
import "./index.css";

export const Form = ({ handleSubmit, inputRef }) => {
  return (
    <form className="chat__form" onSubmit={handleSubmit}>
      <input type="text" className="chat__input" ref={inputRef} />
      <Button type={"submit"} text={"Skicka"} />
    </form>
  );
};
