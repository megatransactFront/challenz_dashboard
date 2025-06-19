import { CoinTransaction } from '@/app/types';
import supabase from '@/config/supabaseClient.js';

export const fetchUserCoinTransactionsData = async (userId: string): Promise<CoinTransaction[]> => {
    const { data: coinTransactions, error } = await supabase
        .from('coin_transactions')
        .select('type, amount, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

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

export const countTotalUsers = async () => {
    const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting users:', countError);
        throw new Error('Failed to count users');
    }
    return count;
}

export const fetchUsersData = async (page: number, limit: number) => {
    const { data: users, error: usersError } = await supabase
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
        .select('id, first_name')
        .eq('id', userId)
        .order('created_at', { ascending: false });

    if (usersError) {
        console.error('Error fetching users:', usersError);
        throw new Error('Failed to fetch users');
    }
    return users
}
