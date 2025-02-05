"use client";

import { LuChevronDown, LuPaperclip, LuSend } from "react-icons/lu";
import { HiArrowPath } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";
import Chat from "./Chat";

interface ChatSectionProps {
  doc_name: string;
  isPreview: boolean;
}

const ChatSection = ({ doc_name, isPreview }: ChatSectionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<{ role: string; content: string }[]>(
    []
  );

  const handleReset = () => {
    setMessage([]);
  };

  const handleSend = () => {
    const inputValue = textareaRef.current?.value.trim();

    if (inputValue) {
      setMessage((prev) => [
        ...prev,
        { role: "user", content: inputValue },
      ]);
      if (textareaRef.current) {
        textareaRef.current.value = "";
        handleInput();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        3 * parseFloat(getComputedStyle(textareaRef.current).lineHeight || "20")
      )}px`;
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message]);

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      // Focus textarea only if there is a keypress and no other input is active
      if (
        document.activeElement === document.body ||
        (document.activeElement instanceof HTMLElement &&
          !["TEXTAREA", "INPUT"].includes(document.activeElement.tagName)) && e.key
      ) {
        textareaRef.current?.focus();
      }
    };

    // Add event listener to listen for keypress
    window.addEventListener("keydown", handleKeyboardEvent);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, []);

  useEffect(() => {
    if (!isPreview) {
      textareaRef.current?.focus();
    }
  }, [isPreview]);

  const handleFocus = () => {
    textareaRef.current?.focus();
  };

  return (
    <div
      className={`w-1/2 bg-[#212121] rounded-lg relative transition-all duration-300 flex-1 mx-auto ${
        isPreview ? "" : "w-full"
      }`}
      onClick={handleFocus}
    >
      <div className="flex justify-between px-5 items-center">
        <h1 className="text-white rounded-t-lg flex gap-2 items-center justify-between h-12">
          Update README:
          <div className="flex items-center text-sm border border-[#383737] hover:bg-[#1f1f1f] cursor-pointer rounded-full py-1.5 px-4">
            {doc_name}
          </div>
        </h1>
        <div className="flex items-center gap-2">
          {message.length > 0 && (
            <>
            <button className="text-black text-sm flex items-center gap-2 cursor-pointer bg-[#F2BD57] rounded-lg py-1 px-3">
                <LuChevronDown size={16} />
                <span>Update Method</span>
            </button>
            <button className="text-sm group flex items-center gap-2 cursor-pointer border text-[#F2BD57] border-[#F2BD57] rounded-lg py-1 px-3" onClick={handleReset}>
              <HiArrowPath
                className="group-focus:animate-spin transition-all duration-300"
                
                size={16}
                />
              <span>Reset</span>
            </button>
            </>
          )}
        </div>
      </div>


      <hr className="border-[#383737]" />

      <div
        ref={chatContainerRef}
        className="chat-container flex flex-col gap-2 py-4 px-10 overflow-y-scroll h-[calc(100vh-13.5rem)]"
      >

        {message.map((msg, index) => (
          <Chat key={index} role={msg.role} content={msg.content} />
        ))}
      </div>

      <div
        className={`absolute bottom-0 py-4 left-1/2 -translate-x-1/2 min-h-14 bg-[#303030] rounded-b-lg transition-all duration-300 w-full ${
          isPreview ? "" : " px-56"
        }`}
      >
        <div className="flex items-end h-full">
          <LuPaperclip className="text-[#B4B4B4] hover:text-white cursor-pointer w-14 h-5" />
          <textarea
            placeholder="Ask a follow-up question"
            ref={textareaRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="bg-transparent flex-1 h-6 text-white outline-none resize-none"
            rows={1}
          />
          <LuSend
            className="text-[#B4B4B4] hover:text-white cursor-pointer w-14 h-5"
            onClick={handleSend}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
