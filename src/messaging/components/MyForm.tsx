import React, { useState } from "react";
import { socket } from "../socket";

export function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit(
      "add-video",
      {
        input:
          "https://www.youtube.com/watch?v=lbjZPFBD6JU&list=RDEM0XNqlolUKJ7yqkB2OwT_oQ&start_radio=1&ab_channel=norahjonesVEVO",
        sourceLanguage: "en",
        targetLanguage: "sk",
      },
      () => {
        setIsLoading(false);
      }
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={(e) => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
