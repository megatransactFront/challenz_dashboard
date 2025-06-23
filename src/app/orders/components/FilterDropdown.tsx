'use client';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type FilterDropdownProps = {
  label?: string;
  value: string | null;
  onChange: (val: string | null) => void;
  options: string[];
  showClear?: boolean;
  widthClass?: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'text-yellow-500';
    case 'Processing':
      return 'text-blue-500';
    case 'Shipped':
      return 'text-indigo-500';
    case 'Delivered':
      return 'text-emerald-500';
    case 'Completed':
      return 'text-green-600';
    case 'Cancelled':
      return 'text-red-600';
    case 'Returned':
      return 'text-orange-500';
    default:
      return '';
  }
};

export function FilterDropdown({
  label = 'Filter by Status',
  value,
  onChange,
  options,
  showClear = false,
  widthClass = 'w-[180px]',
}: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex gap-2 items-center">
        <Select onValueChange={onChange} value={value || ''}>
          <SelectTrigger className={`${widthClass} border-gray-300 rounded-md shadow-sm text-sm bg-white`}>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="text-sm">
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className={getStatusColor(option)}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="text-gray-600 underline"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
