import { CoinTransaction } from '@/app/types';
import supabase from '@/config/supabaseClient.js';
import { startOfToday, subDays, subMonths } from 'date-fns';

export const fetchUserCoinTransactionsData = async (userId: string, filter: string = 'allTime'): Promise<CoinTransaction[]> => {
    let fromDate: Date | null = null;
    const now = new Date();

    switch (filter) {
        case 'today':
            fromDate = startOfToday();
            break;
        case 'lastWeek':
            fromDate = subDays(now, 7);
            break;
        case 'lastMonth':
            fromDate = subMonths(now, 1);
            break;
        case 'allTime':
        default:
            fromDate = null;
            break;
    }

    let query = supabase
        .from('coin_transactions')
        .select('created_at, amount, type')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (fromDate) {
        query = query.gte('created_at', fromDate.toISOString());
    }

    const { data: coinTransactions, error } = await query;

    if (error) {
        console.error('Error fetching user coin transactions:', error);
        throw new Error('Failed to fetch user coin transactions');
    }
    return coinTransactions
}

export const fetchSystemCoinTransactionsData = async (): Promise<CoinTransaction[]> => {
    const { data: coinTransactions, error } = await supabase
        .from('coin_transactions')
        .select('type, amount, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching system coin transactions:', error);
        throw new Error('Failed to fetch system coin transactions');
    }
    return coinTransactions
}

export const countTotalUsers = async (keyword: string) => {
    const { count, error: countError } =
        !!keyword ?
            await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .ilike('username', `%${keyword}%`) :
            await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })

    if (countError) {
        console.error('Error counting users:', countError);
        throw new Error('Failed to count users');
    }
    return count;
}

export const fetchUsersData = async (page: number, limit: number, keyword: string) => {
    const { data: users, error: usersError } =
        !!keyword ?
            await supabase
                .from('users')
                .select('id, username, created_at')
                .ilike('username', `%${keyword}%`)
                .range((page - 1) * limit, page * limit - 1)
                .order('created_at', { ascending: false }) :
            await supabase
                .from('users')
                .select('id, username, created_at')
                .range((page - 1) * limit, page * limit - 1)
                .order('created_at', { ascending: false });

    if (usersError) {
        console.error('Error fetching users:', usersError);
        throw new Error('Failed to fetch users');
    }
    return users
}

export const fetchUserDataById = async (userId: string) => {
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, username')
        .eq('id', userId)
        .order('created_at', { ascending: false });

    if (usersError) {
        console.error('Error fetching users:', usersError);
        throw new Error('Failed to fetch users');
    }
    return users
}
