import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { LuCheck, LuCopy } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

type ChatProps = {
    role: string;
    content: string;
}

const Chat = ({role, content}: ChatProps) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Reset the copied state when the content changes
        setCopied(false);
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);

        const timeout = setTimeout(() => {
            setCopied(false);
        }, 2000);

        return () => clearTimeout(timeout);
    };

    return (
        <div className={`flex items-center mb-2 gap-5 ${role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {role === "user" ? (
                <UserButton />
            ) : (
                <Image src="/gitdoc_ai.png" alt="logo" width={40} height={40} />
            )}
            <div className={`${role === "user" ? "bg-[#303030]" : "bg-[#1d1c1c]"} py-2 px-4 min-w-[12%] max-w-[60%] rounded-lg`}>
                <div className="flex items-center justify-between">
                    <h1 className="me-2">{role === "user" ? "You" : "Gitdocs AI"}</h1>
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger>
                                {copied ? (
                                    <LuCheck className="text-green-500" size={14} />
                                ) : (
                                    <LuCopy className="text-gray-500 hover:text-white cursor-pointer" size={14} onClick={handleCopy} />
                                )}
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-white">
                                {copied ? (
                                    <p className="text-xs">Copied to clipboard</p>
                                ) : (
                                    <p className="text-xs">Copy to clipboard</p>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-gray-500">{content}</p>
            </div>
        </div>
    );
};

export default Chat;
