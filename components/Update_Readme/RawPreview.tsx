import React from "react";
import Editor from "@monaco-editor/react";

const RawPreview = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string | ((prev: string) => string)) => void;
}) => {
  return (
    <div className="h-full bg-[#1e1e1e]">
      {content ? (
        <Editor
          height="calc(100vh - 8rem)"
          defaultLanguage="markdown"
          value={content.replace(/\\n/g, "\n").trim()} // Fixed missing parenthesis here
          onChange={(value) => {
            setContent(value || ""); 
          }}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: false,
            wordWrap: "on",
            theme: "vs-dark",
          }}
        />
      ) : (
        <div className="h-[calc(100vh-15rem)] flex items-center justify-center text-gray-300">
          <p>No Preview Available</p>
        </div>
      )}
    </div>
  );
};

export default RawPreview;