import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';
import { ScrollArea } from './scroll-area-virtualized';

type Option = {
  value: string;
  label: string;
};

interface VirtualizedCommandProps {
  height: string;
  options: Option[];
  notFound: string;
  placeholder: string;
  selectedOption: string;
  onSelectOption?: (option: string) => void;
}

const VirtualizedCommand = ({
  height,
  options,
  notFound,
  placeholder,
  selectedOption,
  onSelectOption
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(false);

  const parentRef = React.useRef(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: 'center'
    });
  };

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase() ?? [])
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? 0 : Math.min(prev + 1, filteredOptions.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? filteredOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (filteredOptions[focusedIndex]) {
          onSelectOption?.(filteredOptions[focusedIndex].value);
        }
        break;
      }
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (selectedOption) {
      const option = filteredOptions.find(
        (option) => option.value === selectedOption
      );
      if (option) {
        const index = filteredOptions.indexOf(option);
        setFocusedIndex(index);
        virtualizer.scrollToIndex(index, {
          align: 'center'
        });
      }
    }
  }, [selectedOption, filteredOptions, virtualizer]);

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput
        onValueChange={handleSearch}
        placeholder={placeholder}
        disabled={options.length === 0}
      />
      <CommandList
        className="w-full overflow-auto pr-1"
        style={{ maxHeight: height }}
        onMouseDown={() => setIsKeyboardNavActive(false)}
        onMouseMove={() => setIsKeyboardNavActive(false)}
      >
        <ScrollArea
          ref={parentRef}
          className="w-full pr-2"
          type="always"
          style={{ height: height }}
        >
          <CommandEmpty>{notFound}</CommandEmpty>
          <CommandGroup>
            <div
              className="relative w-full"
              style={{
                height: `${virtualizer.getTotalSize()}px`
              }}
            >
              {virtualOptions.map((virtualOption) => (
                <CommandItem
                  key={filteredOptions[virtualOption.index].value}
                  value={filteredOptions[virtualOption.index].value}
                  // disabled={isKeyboardNavActive}
                  className={cn(
                    'absolute left-0 top-0 w-full',
                    focusedIndex === virtualOption.index &&
                      'bg-accent text-accent-foreground'
                    // isKeyboardNavActive &&
                    //   focusedIndex !== virtualOption.index &&
                    //   'aria-selected:bg-transparent aria-selected:text-primary'
                  )}
                  style={{
                    height: `${virtualOption.size}px`,
                    transform: `translateY(${virtualOption.start}px)`
                  }}
                  onMouseEnter={() =>
                    !isKeyboardNavActive && setFocusedIndex(virtualOption.index)
                  }
                  onMouseLeave={() =>
                    !isKeyboardNavActive && setFocusedIndex(-1)
                  }
                  onSelect={onSelectOption}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedOption ===
                        filteredOptions[virtualOption.index].value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {filteredOptions[virtualOption.index].label}
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </Command>
  );
};

interface ComboboxVirtualizedProps {
  options: Option[];
  placeholder?: string;
  textNotFound?: string;
  width?: string;
  height?: string;
  onChange: (option: string) => void;
  value: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const ComboboxVirtualized = React.forwardRef<
  HTMLButtonElement,
  ComboboxVirtualizedProps
>(
  (
    {
      options,
      placeholder = 'Search items...',
      textNotFound = 'No item found',
      width = '280px',
      height = '240px',
      onChange,
      value = '',
      isLoading = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [selectedValue, setSelectedValue] = React.useState<string>(value);

    return (
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'flex h-12 min-h-12 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-input px-4 py-2 text-base shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/70 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground/70 [&>span]:line-clamp-1',

              'text-base font-normal',
              className
            )}
            disabled={isLoading || disabled}
            // style={{ minWidth: width }}
            ref={ref}
            {...props}
          >
            {selectedValue ? (
              options.find((option) => option.value === selectedValue)?.label
            ) : (
              <span className="text-muted-foreground/70">{placeholder}</span>
            )}

            <div className="text-muted-foreground/70">
              {isLoading ? (
                <Icons.spinner className="size-6" />
              ) : (
                <ChevronsUpDown
                  className={cn(
                    'ml-2 size-4 shrink-0',
                    selectedValue ? 'opacity-100' : 'opacity-50'
                  )}
                />
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" style={{ width: width }} align="end">
          <VirtualizedCommand
            height={height}
            options={options}
            placeholder={placeholder}
            notFound={textNotFound}
            selectedOption={selectedValue}
            onSelectOption={(currentValue) => {
              const newValue =
                currentValue === selectedValue ? '' : currentValue;
              onChange && onChange(newValue);
              setSelectedValue(newValue);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

export { ComboboxVirtualized };
