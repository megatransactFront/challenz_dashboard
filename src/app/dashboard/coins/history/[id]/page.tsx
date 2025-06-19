"use client"
import { fetchUserCoinTransactionsData, fetchUserDataById } from "@/app/api/dashboard/coins/coinDbAccess";
import { TransactionHistoryTable } from "@/app/dashboard/components/coins/TransactionHistoryTable";
import { CoinTransaction } from "@/app/types";
import { Separator } from "@/components/ui/separator";
import useMobile from "@/hooks/useMobile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filter, setFilter] = useState('today');
    const [userTransactions, setUserTransactions] = useState<CoinTransaction[]>([]);
    const [userData, setUserData] = useState({ id: '', first_name: '' });

    const params = useParams();
    const userId = params?.id as string;

    const fetchUserCoinTransactions = async (userId: string) => {
        setIsLoading(true);
        try {
            const usersTransactionData = await fetchUserCoinTransactionsData(userId);
            const user = await fetchUserDataById(userId);

            setUserData(user[0]);
            setUserTransactions(usersTransactionData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching coin data:', err);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchUserCoinTransactions(userId)

    }, [userId, filter]);
    return (
        <div>
            <div className="mb-3 flex flex-wrap justify-center items-center sm:justify-between md:mr-20">
                <h1 className="font-bold text-sm md:text-2xl xl:text-4xl">
                    {userData?.first_name || ''}&apos;s Transaction History
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
            <TransactionHistoryTable transactions={userTransactions} />
        </div>
    )
}

export default TransactionHistory
