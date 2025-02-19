import { LuFolder } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import { Star } from "lucide-react";
import updatedAgo from "@/lib/UpdatedDate";
import RepoTools from "./RepoTools";
import Link from "next/link";

interface Repo {
    name: string;
    gitLink: string;
    lastUpdated: string;
    status: string;
    recentCommitDescription: string;
    suggestions: number;
    visibility: string;
    starred: boolean;
    score: number;
}

const RepoCards = ({ repo, handleStarClick }: { repo: Repo, handleStarClick: (repoName: string) => void }) => {
    return (
        <div className="border border-[#232323] hover:border-[#3196e3] bg-[#0A0A0A] transition-all duration-150 overflow-hidden px-6 py-5 rounded-lg shadow-sm">
            <div className="mb-3 flex items-center justify-between font-medium text-[#dedbdb]">

                <div className="flex items-center gap-2">
                <LuFolder size={20} />
                <p className="truncate max-w-[170px]">{repo.name}</p>
                <p className="text-xs rounded-full bg-[#171717] px-2 py-1 text-gray-500">{repo.visibility}</p>
                </div>

                {repo.starred ? (
                    <Star size={20} className="text-[#F8C75D] cursor-pointer" onClick={() => handleStarClick(repo.name)} />
                ) : (
                    <Star size={20} className="text-gray-500 cursor-pointer" onClick={() => handleStarClick(repo.name)} />
                )}

            </div>

            <Link 
            href={repo.gitLink} 
            target="_blank" 
            className="mb-3 text-[#dbd5d5] flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 w-fit"
            >
            <FaGithub size={16} />
            <p className="truncate text-xs font-semibold">{repo.gitLink.split('github.com/')[1]}</p>  {/* Extract username/repository */}
            </Link>


            <p className="text-xs text-gray-500">
                {repo.recentCommitDescription}
            </p>

            <p className="text-xs text-gray-500 mt-2">Last Updated: {updatedAgo(new Date(repo.lastUpdated)) < 7 
            ? updatedAgo(new Date(repo.lastUpdated)) + ' days ago' 
            : 'on ' + new Date(repo.lastUpdated).toLocaleDateString()}  
             </p>

            <div className="flex items-center gap-3 ms-1">
            </div>
            <RepoTools doc_name={repo.name} doc_score={repo.score} />
        </div>
    )
}
export default RepoCards