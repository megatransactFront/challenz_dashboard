import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  label: string;
  value: string | null;
  onChange: (val: string) => void;
  options: string[];
  widthClass?: string;
};

const statusColors: Record<string, string> = {
  ACTIVE: 'text-green-600',
  CANCELED: 'text-red-600',
  PAST_DUE: 'text-yellow-600',
  PENDING_FIRST_PAYMENT: 'text-blue-600',
  REFUNDED: 'text-purple-600',
  CANCEL_AT_PERIOD_END: 'text-orange-500',
};

export const FilterDropdown = ({ label, value, onChange, options, widthClass = '' }: Props) => {
  return (
    <div className={`flex flex-col gap-1 flex-1 min-w-[180px] ${widthClass}`}>
      <label className="text-sm text-gray-600">{label}</label>
      <Select value={value ?? ''} onValueChange={onChange}>
        <SelectTrigger className="w-full px-3 py-2 border rounded bg-white">
          <SelectValue
            className={value ? statusColors[value] : ''}
            placeholder="Select status"
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt}
              value={opt}
              className={statusColors[opt] || 'text-gray-700'}
            >
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
