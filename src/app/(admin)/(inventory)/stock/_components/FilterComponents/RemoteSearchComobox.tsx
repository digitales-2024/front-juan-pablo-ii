"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

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
import { UseQueryResult } from "@tanstack/react-query";
import SmallLoading from "../errorComponents/SmallLoading";
import { useMemo } from "react";
import NotFoundSearchResults from "../errorComponents/NotFoundSearchResults";
import SmallErrorMessage from "../errorComponents/SmallErrorMessage";
//import { ALIGN_OPTIONS } from "@radix-ui/react-popper";

export type ComboBoxItemType = {
  value: string;
  label: string;
};

type ComboboxProps<T> = {
  value?: string;
  label?: string;
  onSelect: (value: string, label?: string) => void;
  items: ComboBoxItemType[];
  queryState: UseQueryResult<T[], Error>;
  searchPlaceholder?: string;
  noResultsMsg?: string;
  selectItemMsg?: string | React.ReactNode;
  className?: string;
  unselect?: boolean;
  unselectMsg?: string;
  onSearchChange?: (e: string) => void;
  disabled?: boolean;
  selected?: string[];
  popoverSameWidthAsTrigger?: boolean;
  align?: "start" | "center" | "end"; //(typeof ALIGN_OPTIONS)[number];
  popoverContentClassName?: string;
  total?: number;
};

const popOverStyles = {
  width: "var(--radix-popover-trigger-width)",
};

export function SearchCombobox<T = unknown>({
  value,
  label,
  onSelect,
  items,
  queryState,
  searchPlaceholder = "Busca un item...",
  noResultsMsg = "Sin resultados",
  selectItemMsg = "Selecciona un item",
  className,
  unselect = false,
  unselectMsg = "Limpiar", //"None"
  onSearchChange,
  disabled = false,
  selected = [],
  popoverSameWidthAsTrigger = true,
  align,
  popoverContentClassName,
  total,
}: ComboboxProps<T>) {
  const [open, setOpenState] = React.useState(false);
  const { isError, isLoading, isLoadingError, error, data, refetch } = queryState;
    const warningsMessages = useMemo(() => ({
        loading: "Cargando...",
        loadingError: "Fallo en la carga de los items",
        noItemsFound: "Sin resultados",
        //additionalOptions: "additional options are hidden.",
    }), []);

  const more = total ? total - items.length : 0;

  const handleOnSearchChange = useDebouncedCallback((value: string) => {
    onSearchChange?.(value);
  }, 300) as (value: string) => void;

  function setOpen(isOpen: boolean) {
    if (!isOpen) handleOnSearchChange("None"); //When the popover is closed, the search is reset
    setOpenState(isOpen);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          <span className="truncate flex items-center">
            {label ?? selectItemMsg}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={popoverSameWidthAsTrigger ? popOverStyles : {}}
        className={cn("p-0", popoverContentClassName)}
        align={align}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleOnSearchChange}
          />
          <CommandList>
            {/* <CommandEmpty>{noResultsMsg}</CommandEmpty> */}
            {!isLoading && !isError && items.length === 0 && <CommandEmpty>{noResultsMsg}</CommandEmpty>}
            {isLoading && <CommandEmpty>{warningsMessages.loading}</CommandEmpty>}
            {isError && <CommandEmpty>{error?.message}</CommandEmpty>}
            {isLoadingError && <CommandEmpty>{warningsMessages.loadingError}</CommandEmpty>}
            {
                isLoading && <CommandGroup>
                    <SmallLoading></SmallLoading>
                </CommandGroup>
            }
            {
                isError && <CommandGroup>
                    <SmallErrorMessage error={error} reset={refetch}></SmallErrorMessage>
                </CommandGroup>
            }
            {
                isLoadingError && <CommandGroup>
                    <SmallErrorMessage error={error} reset={refetch}></SmallErrorMessage>
                </CommandGroup>
            }
            {!isLoading && !isError && items.length === 0 && <CommandGroup>
                    <NotFoundSearchResults></NotFoundSearchResults>
                </CommandGroup>}
            {
              data && <CommandGroup>
                {unselect && (
                  <CommandItem
                    key="unselect"
                    value=""
                    onSelect={() => {
                      onSelect("");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {unselectMsg}
                  </CommandItem>
                )}
                {items.map((item) => {
                  const isSelected =
                    value === item.value || selected.includes(item.value);
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      keywords={[item.label]}
                      onSelect={(value) => {
                        onSelect(value, item.label);
                        setOpen(false);
                      }}
                      disabled={isSelected}
                    >
                      {item.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            }
          </CommandList>
          {!!more && (
            <div className="px-3 py-2.5 text-sm opacity-50">
              {more} additional options are hidden.
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
