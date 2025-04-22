"use client"
import { TransactionHistoryTable } from "@/app/dashboard/components/coins/TransactionHistoryTable";
import { Separator } from "@/components/ui/separator";
import useMobile from "@/hooks/useMobile";
import { useState } from "react";
const usersTransaction =
{
    userId: 1,
    name: "Jeremy Evans",
    transactions: [
        { date: "24 Mar 2020", partnerShop: "Apple Store", uwcSpent: 50 },
        { date: "18 Mar 2020", partnerShop: "Spotify", uwcSpent: 50 },
        { date: "12 Mar 2020", partnerShop: "JetStar", uwcSpent: 50 }
    ]
}
const TransactionHistory = () => {
    const isMobile = useMobile();
    const timeframes = [
        {
            key: "today",
            title: "Today",
            separator: true
        },
        {
            key: "lastWeek",
            title: isMobile ? "Last Week" : "Last 7 Days",
            separator: true
        },
        {
            key: "lastMonth",
            title: "Last Month",
        }
    ]
    const [filter, setFilter] = useState('today');
    // const params = useParams();
    // const userId = params?.id;
    const firstName = usersTransaction?.name?.split(' ')[0]
    return (
        <div>
            <div className="mb-3 flex flex-wrap justify-center items-center sm:justify-between md:mr-20">
                <h1 className="font-bold text-sm md:text-2xl xl:text-4xl">
                    {firstName}&apos;s Transaction History
                </h1>
                <div className="flex h-5 items-center space-x-4 font-medium">
                    {timeframes.map((timeframe) => (
                        <>
                            <div key={timeframe?.key} className="cursor-pointer" onClick={() => setFilter(timeframe?.key)}>
                                <div className="text-xs md:text-lg">
                                    {timeframe?.title}
                                </div>
                                <Separator className={timeframe?.key === filter ? "bg-[#E45664]" : undefined} />
                            </div>
                            {timeframe?.separator && <Separator orientation="vertical" />}

                        </>
                    ))}
                </div>
            </div>
            <TransactionHistoryTable transactions={usersTransaction?.transactions} />
        </div>
    )
}

export default TransactionHistory
