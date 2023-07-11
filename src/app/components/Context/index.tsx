import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { urls } from "./urls";
import UrlButton from "./UrlButton";
import { Card, ICard } from "./Card";
import { clearIndex, crawlDocument } from "./utils";

import { Button } from "./Button";
interface ContextProps {
  className: string;
  selected: string[] | null;
}

export const Context: React.FC<ContextProps> = ({ className, selected }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);

  const [splittingMethod, setSplittingMethod] = useState("markdown");
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(1);

  // Scroll to selected card
  useEffect(() => {
    const element = selected && document.getElementById(selected[0]);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-white p-2 font-bold">
      {children}
    </label>
  );

  const buttons = entries.map((entry, key) => (
    <UrlButton
      key={`${key}-${entry.loading}`}
      entry={entry}
      onClick={() =>
        crawlDocument(
          entry.url,
          setEntries,
          setCards,
          splittingMethod,
          chunkSize,
          overlap
        )
      }
    />
  ));
  return (
    <div
      className={`flex flex-col space-y-4 overflow-y-scroll items-center ${className}`}
    >
      <div className="flex flex-col items-center sticky top-0">
        <div className="flex p-2">
          {buttons}
          <div className="flex-grow px-2">
            <Button
              className="w-full my-2"
              style={{
                backgroundColor: "#4f6574",
                color: "white",
              }}
              onClick={() => clearIndex(setEntries, setCards)}
            >
              Clear Index
            </Button>
          </div>
        </div>
        <div className="flex p-2"></div>
        <div className="text-left w-full ml-1 mr-1 flex flex-col bg-gray-600 p-3  subpixel-antialiased">
          <DropdownLabel htmlFor="splittingMethod">
            Splitting Method:
          </DropdownLabel>
          <select
            id="splittingMethod"
            value={splittingMethod}
            className="p-2 bg-gray-700 rounded text-white"
            onChange={(e) => setSplittingMethod(e.target.value)}
          >
            <option value="recursive">Recursive Text Splitting</option>
            <option value="markdown">Markdown Splitting</option>
          </select>
          {splittingMethod === "recursive" && (
            <div className="my-4 flex flex-col">
              <div className="flex flex-col w-full">
                <DropdownLabel htmlFor="chunkSize">
                  Chunk Size: {chunkSize}
                </DropdownLabel>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="chunkSize"
                  min={1}
                  max={2048}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-full">
                <DropdownLabel htmlFor="overlap">
                  Overlap: {overlap}
                </DropdownLabel>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="overlap"
                  min={1}
                  max={200}
                  onChange={(e) => setOverlap(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        {cards &&
          cards.map((card, key) => (
            <Card key={key} card={card} selected={selected} />
          ))}
      </div>
    </div>
  );
};
