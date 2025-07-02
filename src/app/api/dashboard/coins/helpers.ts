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

export const downloadCSV = (data: Record<string, any>[], headers: string[], filename: string) => {
    const rows = data.map(t => Object.values(t));

    const csvContent =
        [headers, ...rows]
            .map(row => row.map(value => `"${value}"`).join(','))
            .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};