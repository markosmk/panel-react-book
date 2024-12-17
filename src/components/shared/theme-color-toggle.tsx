import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import { ThemeColors } from '@/types/theme-types';

const availablesThemeColors = [
  { name: 'Zinc', light: 'bg-zinc-900', dark: 'bg-zinc-700' },
  { name: 'Rose', light: 'bg-rose-600', dark: 'bg-rose-700' },
  { name: 'Blue', light: 'bg-blue-600', dark: 'bg-blue-700' },
  { name: 'Green', light: 'bg-green-600', dark: 'bg-green-700' },
  { name: 'Orange', light: 'bg-orange-600', dark: 'bg-orange-700' }
];

export function ThemeColorToggle() {
  const { themeColor, setThemeColor, theme } = useTheme();

  const createSelectItems = () => {
    return availablesThemeColors.map((color) => (
      <SelectItem key={color.name} value={color.name}>
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              'size-5 rounded-full',
              theme === 'light' ? color.light : color.dark
            )}
          ></div>
          <div className="text-sm font-medium">{color.name}</div>
        </div>
      </SelectItem>
    ));
  };

  return (
    <Select
      value={themeColor}
      onValueChange={(value) => setThemeColor(value as ThemeColors)}
    >
      <SelectTrigger
        className={cn(
          'w-full px-2 ring-offset-transparent focus:ring-transparent'
        )}
      >
        <SelectValue placeholder="Selecciona un Color" />
      </SelectTrigger>
      <SelectContent>{createSelectItems()}</SelectContent>
    </Select>
  );
}
