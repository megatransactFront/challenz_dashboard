export const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1)} Billion`;
    } else if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)} mil`;
    }
    return `${num.toLocaleString()}`;
};

export const isToday = (inputDate: Date): boolean => {
    const today = new Date();

    return (
        inputDate.getFullYear() === today.getFullYear() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getDate() === today.getDate()
    );
}