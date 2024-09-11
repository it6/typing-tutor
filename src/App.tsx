import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import allWords from "./assets/words";

function fillWords(allWords: { simple: string[]; advanced: string[] }) {
  const words: Array<string> = [];
  while (words.length < 100) {
    words.push(
      ...(allWords.simple[
        Math.floor(Math.random() * allWords.simple.length)
      ] as string)
    );
    words.push(" ");
    words.push(
      ...(allWords.advanced[
        Math.floor(Math.random() * allWords.advanced.length)
      ] as string)
    );
    words.push(" ");
  }
  return words;
}

function App() {
  const [errorIndex, setErrorIndex] = useState(new Set());
  const [sourceWords, setSourceWords] = useState([""]);
  const [targetWords, setTargetWords] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setSourceWords(fillWords(allWords));
    setTargetWords("");
    setErrorIndex(new Set());
  }, [completed]);

  function handleType(e: ChangeEvent<HTMLTextAreaElement>) {
    const cur = e.target.value;

    if (cur.length >= sourceWords.length) {
      setCompleted(!completed);
      return;
    } else if (cur.length <= targetWords.length) {
      let end = targetWords.length;
      const start = cur.length;
      const newErrorIndex = new Set(errorIndex);
      while (end >= start) {
        newErrorIndex.delete(end);
        end--;
      }
      // newErrorIndex.delete(cur.length);
      setErrorIndex(newErrorIndex);
    } else if (cur.length && cur.at(-1) != sourceWords[cur.length - 1]) {
      setErrorIndex((errors) => {
        errors.add(e.target.value.length - 1);
        return errors;
      });
    }
    setTargetWords(cur);
  }

  function sourceWordsUI() {
    return sourceWords.map((char, index) => {
      if (errorIndex.has(index)) {
        return (
          <span className="text-red-400" key={index}>
            {char}
          </span>
        );
      } else if (targetWords.length == index) {
        return (
          <span className="bg-gray-700 rounded-sm" key={index}>
            {char}
          </span>
        );
      } else if (index < targetWords.length) {
        return (
          <span className="text-green-400" key={index}>
            {char}
          </span>
        );
      }
      return char;
    });
  }

  return (
    <div className="flex flex-col text-2xl items-start">
      <div className="w-[100%] text-left p-10 rounded-xl text-gray-400 text-3xl tracking-widest">
        {sourceWordsUI()}
      </div>
      <textarea
        autoFocus
        className="w-[100%] text-left p-10 mt-20 outline-none rounded-xl bg-gray-900 text-gray-400  text-3xl tracking-widest resize-none"
        onChange={handleType}
        value={targetWords}
      />
    </div>
  );
}

export default App;
