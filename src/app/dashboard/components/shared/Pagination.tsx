type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-between items-center pt-4">
            <button
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded bg-primary disabled:opacity-50 text-white"
            >
                Prev
            </button>
            <p>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </p>
            <button
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded bg-primary disabled:opacity-50 text-white"
            >
                Next
            </button>
        </div>
    );
}