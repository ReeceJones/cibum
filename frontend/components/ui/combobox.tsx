"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMeasure } from "@uidotdev/usehooks";
import { ClipLoader } from "react-spinners";

interface ComboboxOptions<T> {
  data: Array<T>;
  getKey: (item: T) => string;
  getLabel: (item: T, listView: boolean) => React.ReactNode;
  getSearchKeywords?: (item: T) => string[];
  notFound?: React.ReactNode;
  select?: React.ReactNode;
  placeholder?: string;
  loading?: boolean;
  error?: React.ReactNode;
  className?: string;
}

export interface RequiredComboboxOptions<T> extends ComboboxOptions<T> {
  required: true;
  value: T;
  onChange: (value: T) => void;
}

export interface OptionalComboboxOptions<T> extends ComboboxOptions<T> {
  required?: false;
  value?: T;
  onChange?: (value: T | undefined) => void;
}

export type ComboboxProps<T> =
  | RequiredComboboxOptions<T>
  | OptionalComboboxOptions<T>;

export function Combobox<T>({
  data,
  getKey,
  getLabel,
  getSearchKeywords,
  placeholder,
  notFound,
  select,
  loading,
  value,
  onChange,
  required,
  error,
  className,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<T | undefined>(
    undefined
  );
  const selected = value ?? internalValue;
  const setSelected = onChange ?? setInternalValue;
  const [ref, rect] = useMeasure();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
          ref={ref}
        >
          {selected
            ? getLabel(
                data.find((option) => getKey(option) === getKey(selected))!,
                false
              )
            : select ?? "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: rect.width ?? undefined }}
      >
        <Command>
          <CommandInput placeholder={placeholder ?? "Search..."} />
          <CommandList>
            {error && (
              <div className="flex justify-center p-4 text-destructive">
                {error}
              </div>
            )}
            {loading && !error && (
              <div className="flex justify-center p-4">
                <ClipLoader size={24} />
              </div>
            )}
            {!loading && !error && (
              <>
                <CommandEmpty>{notFound ?? "Nothing found."}</CommandEmpty>
                <CommandGroup>
                  {data.map((option) => (
                    <CommandItem
                      key={getKey(option)}
                      value={getKey(option)}
                      keywords={getSearchKeywords?.(option)}
                      onSelect={(currentValue) => {
                        if (!required) {
                          if (
                            selected !== undefined &&
                            currentValue === getKey(selected)
                          ) {
                            //@ts-expect-error undefined is not compatible with T
                            setSelected(undefined);
                          } else {
                            setSelected(option);
                          }
                        } else {
                          setSelected(option);
                        }

                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected && getKey(selected) === getKey(option)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {getLabel(option, true)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
