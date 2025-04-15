export const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return 'Invalid Date';
    }
};

export const formatDateWithSign = (dateInput: string | Date, sign: string): string => {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}${sign}${month}${sign}${year}`;
}