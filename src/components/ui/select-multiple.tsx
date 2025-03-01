import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';

function BadgeSelect({
  value,
  onRemove
}: {
  value: string;
  onRemove?: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 items-center rounded-md bg-background px-2 py-1 text-secondary-foreground">
      <span className="truncate px-2 py-0.5 text-sm">{value}</span>
      {onRemove && (
        <div
          role="button"
          className="rounded-full p-1 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(value);
          }}
        >
          <X className="size-4" />
        </div>
      )}
    </div>
  );
}

export interface MultiSelectOptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectContextValue {
  selectedValues: string[];
  handleSelect: (value: string) => void;
  handleDeselect: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MultiSelectContext = React.createContext<
  MultiSelectContextValue | undefined
>(undefined);

function useMultiSelect() {
  const context = React.useContext(MultiSelectContext);
  if (!context)
    throw new Error('useMultiSelect must be used within MultiSelectProvider');
  return context;
}

interface MultiSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  maxDisplay?: number;
  children?: React.ReactNode;
  options: MultiSelectOptionItem[];
  isProcesingOptions?: boolean;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  value: valueProp = [],
  onChange,
  placeholder = 'Select...',
  maxDisplay = 1,
  options = [],
  disabled,
  isProcesingOptions = false,
  children
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(valueProp);

  const handleSelect = React.useCallback(
    (value: string) => {
      if (selectedValues.includes(value)) {
        const newValues = selectedValues.filter((v) => v !== value);
        setSelectedValues(newValues);
        onChange?.(newValues);
      } else {
        const newValues = [...selectedValues, value];
        setSelectedValues(newValues);
        onChange?.(newValues);
      }
    },
    [selectedValues, onChange]
  );

  const handleDeselect = React.useCallback(
    (value: string) => {
      const newValues = selectedValues.filter((v) => v !== value);
      setSelectedValues(newValues);
      onChange?.(newValues);
    },
    [selectedValues, onChange]
  );

  const handleEmpty = React.useCallback(() => {
    setSelectedValues([]);
    onChange?.([]);
  }, [onChange]);

  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child) && child.props.value) {
      const label =
        child.props.children || child.props.label || child.props.value;
      return label.toString().toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <MultiSelectContext.Provider
      value={{
        selectedValues,
        handleSelect,
        handleDeselect,
        searchTerm,
        setSearchTerm
      }}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            disabled={isProcesingOptions || disabled}
            className={cn(
              'relative flex w-full justify-between gap-2 text-base font-normal',
              maxDisplay > 1 && selectedValues.length > 1 && 'h-auto min-h-12'
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {maxDisplay === 1 && selectedValues.length > 1 ? (
                  <BadgeSelect
                    value={`+${selectedValues.length} seleccionados`}
                    onRemove={handleEmpty}
                  />
                ) : (
                  selectedValues.slice(0, maxDisplay).map((value) => (
                    <BadgeSelect
                      key={value}
                      value={
                        options.find((option) => option.value === value)
                          ?.label || ''
                      }
                      onRemove={() => {
                        handleDeselect(value);
                      }}
                    />
                  ))
                )}
                {maxDisplay > 1 && selectedValues.length > maxDisplay && (
                  <BadgeSelect
                    value={`+${selectedValues.length - maxDisplay} seleccionados`}
                    onRemove={handleEmpty}
                  />
                )}
              </div>
            ) : (
              <span className="select-none truncate text-muted-foreground/70">
                {placeholder}
              </span>
            )}

            {isProcesingOptions ? (
              <Icons.spinner className="size-6" />
            ) : (
              <ChevronsUpDown className="size-4 min-w-4 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-sm p-0" align="end">
          <Command
            filter={(value, search, keywords) => {
              const extendValue = value + ' ' + keywords?.join(' ');
              if (extendValue?.toLowerCase().includes(search.toLowerCase()))
                return 1;
              return 0;
            }}
          >
            <CommandInput placeholder="Buscar opcion..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options &&
                  options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                      keywords={[option.label]}
                      disabled={option.disabled}
                    >
                      {option.label}
                      {selectedValues.includes(option.value) && (
                        <Check className="ml-auto size-5" />
                      )}
                    </CommandItem>
                  ))}
                {children &&
                  (filteredChildren.length > 0 ? (
                    filteredChildren
                  ) : (
                    <div className="p-2 text-gray-500">
                      No options available
                    </div>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </MultiSelectContext.Provider>
  );
};
MultiSelect.displayName = 'MultiSelect';

type MultiSelectItemProps = React.ComponentPropsWithoutRef<typeof CommandItem> &
  Partial<MultiSelectOptionItem> & {
    value: string;
    disabled?: boolean;
    keyword?: string;
    children: React.ReactNode;
  };

const MultiSelectItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  MultiSelectItemProps
>(
  (
    {
      value,
      children,
      disabled: disabledProp,
      className,
      keyword = undefined,
      ...props
    },
    forwardedRef
  ) => {
    const { selectedValues, handleSelect } = useMultiSelect();
    const isSelected = selectedValues.includes(value);

    return (
      <CommandItem
        {...props}
        value={value}
        className={cn(
          disabledProp && 'cursor-not-allowed text-muted-foreground',
          className
        )}
        disabled={disabledProp}
        keywords={keyword ? [keyword] : undefined}
        onSelect={() => !disabledProp && handleSelect(value)}
        ref={forwardedRef}
      >
        <span className="mr-2 truncate">{children || value}</span>
        {isSelected ? <Check className="ml-auto size-4 shrink-0" /> : null}
      </CommandItem>
    );
  }
);
MultiSelectItem.displayName = 'MultiSelectItem';

const MultiSelectGroup = React.forwardRef<
  React.ElementRef<typeof CommandGroup>,
  React.ComponentPropsWithoutRef<typeof CommandGroup>
>((props, forwardRef) => {
  return <CommandGroup {...props} ref={forwardRef} />;
});
MultiSelectGroup.displayName = 'MultiSelectGroup';

const MultiSelectSeparator = React.forwardRef<
  React.ElementRef<typeof CommandSeparator>,
  React.ComponentPropsWithoutRef<typeof CommandSeparator>
>((props, forwardRef) => {
  return <CommandSeparator {...props} ref={forwardRef} />;
});
MultiSelectSeparator.displayName = 'MultiSelectSeparator';

export { MultiSelect, MultiSelectItem, MultiSelectGroup, MultiSelectSeparator };
