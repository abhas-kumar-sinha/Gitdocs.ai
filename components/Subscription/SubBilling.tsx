"use client"

import PlanCards from "./PlanCards";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/contexts/AppContext";
import { BsDownload, BsEye } from "react-icons/bs";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";


interface User {
  subscriptionType: string;
  stepsCompleted: number;
}

interface AppContextType {
  storedUser: User | null;
}

const SubBilling = () => {

    const { storedUser } = useContext(AppContext) as AppContextType;
    const { user } = useUser();

    const [billingData, setBillingData] = useState<any>(null);

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await axios.patch(
                    "/api/fetch/subscriptiondata?query=billingData",
                    {}, // Empty body for PATCH request
                    {
                        headers: {
                            Authorization: `Bearer ${user?.id}`,
                        },
                    }
                );
                setBillingData(response.data.data);
            } catch (error) {
                console.error("Error fetching billing data:", error);
            }
        };
    
        if (user) {
            fetchBillingData();
        }
    }, [user, billingData]);
    
    let billingHistory: any[] = [];

    if (billingData) {
        billingHistory = billingData.billingHistory;
    }

    const plans = [
        {
        name: "Free",
        tagline: "Starter plan",
        price: 0,
        isActive: storedUser?.subscriptionType === "Free",
        features: [
            "Upto 3 repositories",
            "10k tokens",
            "Basic AI Documentation",
            "Community Support",
            "Limited Access to Premium Features",
        ],
        },
        {
        name: "Pro",
        tagline: "Growth plan",
        price: 9,
        isActive: storedUser?.subscriptionType === "Pro",
        features: [
            "Upto 10 repositories",
            "2M tokens",
            "Advanced AI Documentation",
            "Priority Support",
            "Unlimited Access to Premium Features",
        ],
        },
        {
        name: "Advanced",
        tagline: "Custom plan",
        price: 19,
        isActive: storedUser?.subscriptionType === "Enterprise",
        features: [
            "Upto 100 repositories",
            "20M tokens",
            "Custom Features",
        ],
        },
    ];

    return (
        <>
            <h1 className="text-lg font-semibold">Billing & Subscription</h1>
            <p className="text-sm mt-1 text-[#999]">Keep track of your subscription and billing information.</p>

            <div className="flex gap-5 mt-4">
            {plans.map((plan) => (
                <div key={plan.name} className="flex flex-col items-start transition-all duration-150 bg-[#1A1A1A] hover:bg-gradient-to-br hover:from-[#1A1A1A] hover:to-[#282828] p-3 rounded-xl w-full border border-[#282828]">
                <PlanCards plan={plan} />
                </div>
            ))}
            </div>

            <div className="flex flex-col mt-6 items-start bg-[#1A1A1A] p-3 pb-5 rounded-xl w-full border border-[#2d3237]">
            <h3 className="font-semibold">Billing History</h3>
            <p className="text-sm mt-1 text-[#999]">View your billing history and manage your payment information.</p>
                <div className="grid grid-cols-12 w-full px-3 mt-5 bg-[#262626] rounded-lg py-3.5 mb-1">
                    <span className="text-sm text-[#999] col-span-3">Plan Name</span>
                    <span className="text-sm text-[#999] col-span-2">Amount</span>
                    <span className="text-sm text-[#999] col-span-2">Purchase Date</span>
                    <span className="text-sm text-[#999] col-span-2">End Date</span>
                    <span className="text-sm text-[#999] col-span-2">Status</span>
                    <span className="text-sm text-[#999] col-span-1">Actions</span>
                </div>
                <div className="w-full max-h-80 overflow-y-auto">
                {billingHistory && billingHistory.length > 0 && billingHistory.map((history: any) => (
                <div key={history.planName} className="grid grid-cols-12 w-full px-3 border-b border-[#2d3237] py-2 hover:bg-[#2d3237]/50 rounded-lg text-sm">
                    <span className="text-sm text-[#999] col-span-3 mt-1.5">{history.planName}</span>
                    <span className="text-sm text-[#999] col-span-2 mt-1.5">$ {history.amount}.00</span>
                    <span className="text-sm text-[#999] col-span-2 mt-1.5">{history.purchaseDate}</span>
                    <span className="text-sm text-[#999] col-span-2 mt-1.5">{history.endDate}</span>
                    <span className="text-sm text-[#999] col-span-2 mt-1.5">{history.status}</span>
                    <span className="text-sm text-[#999] col-span-1 flex gap-3">
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                        <TooltipTrigger>
                            <Link href="/billing" className="cursor-pointer flex p-2 rounded-md text-[#ededed] bg-[#2d3237]"><BsDownload /></Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8} className="bg-[#E8E8E9] text-black">
                            <span className="text-xs">Download</span>
                        </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                        <TooltipTrigger>
                            <span className="cursor-pointer p-2 rounded-md text-[#ededed] flex bg-[#2d3237]"><BsEye /></span>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={6} className="bg-[#E8E8E9] text-black">
                            <span className="text-xs">View</span>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    </span>
                </div>
                ))}
                </div>
                {billingHistory.length === 0 && (
                <div className="text-sm text-[#999] w-full text-center mt-4">No billing history found</div>
                )}
            </div>
        </>
    )
}
export default SubBilling