import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import {
    useState,
    useRef,
    useCallback,
    useEffect,
    type KeyboardEvent,
} from "react";

import { cn } from "@/lib/utils";

import {
    CommandGroup,
    CommandItem,
    CommandList,
    CommandInput,
} from "./command";
import { ScrollArea } from "./scroll-area";
import { Skeleton } from "./skeleton";

export type Option = {
    value: string;
    label: string;
    [key: string]: string;
};

type AutoCompleteProps = {
    options: Option[];
    emptyMessage: string;
    value?: Option;
    onValueChange?: (value: Option) => void;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
};

export const AutoComplete = ({
    options,
    placeholder,
    emptyMessage,
    value,
    onValueChange,
    disabled,
    isLoading = false,
    className,
}: AutoCompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option | undefined>(value);
    const [inputValue, setInputValue] = useState<string>(value?.label || "");

    // Actualiza el estado interno cuando cambia la propiedad value
    useEffect(() => {
        setSelected(value);
        setInputValue(value?.label || "");
    }, [value]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (!input) {
                return;
            }

            if (!isOpen) {
                setOpen(true);
            }

            if (event.key === "Enter" && input.value.trim() !== "") {
                // Buscar coincidencias exactas basadas en el label
                const exactMatches = options.filter(
                    (option) =>
                        option.label.toLowerCase() ===
                        input.value.trim().toLowerCase(),
                );

                if (exactMatches.length === 1) {
                    setSelected(exactMatches[0]);
                    onValueChange?.(exactMatches[0]);
                    setOpen(false);
                } else if (exactMatches.length > 1) {
                    // Seleccionar la primera coincidencia o manejar múltiples según se requiera
                    setSelected(exactMatches[0]);
                    onValueChange?.(exactMatches[0]);
                    setOpen(false);
                } else {
                    // Opcional: manejar caso donde no hay coincidencias
                }
            }

            if (event.key === "Escape") {
                input.blur();
            }
        },
        [isOpen, options, onValueChange],
    );

    const handleBlur = useCallback(() => {
        setOpen(false);
        setInputValue(selected?.label || "");
    }, [selected]);

    const handleSelectOption = useCallback(
        (selectedOption: Option) => {
            setInputValue(selectedOption.label);
            setSelected(selectedOption);
            onValueChange?.(selectedOption);
            setOpen(false);

            setTimeout(() => {
                inputRef?.current?.blur();
            }, 0);
        },
        [onValueChange],
    );

    return (
        <CommandPrimitive onKeyDown={handleKeyDown}>
            <CommandInput
                ref={inputRef}
                value={inputValue}
                onValueChange={isLoading ? undefined : setInputValue}
                onBlur={handleBlur}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                className="text-sm capitalize"
            />

            <div
                className={cn("relative", isOpen ? "mt-1" : "mt-0", className)}
            >
                <div
                    className={cn(
                        "absolute top-0 z-10 w-full rounded-xl border border-input bg-white shadow outline-none animate-in fade-in-0 zoom-in-95",
                        isOpen ? "block" : "hidden",
                    )}
                >
                    <ScrollArea className="h-[10rem]">
                        <CommandList className="h-full rounded-lg capitalize ring-1 ring-slate-200">
                            {isLoading && (
                                <CommandPrimitive.Loading>
                                    <div className="p-1">
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </CommandPrimitive.Loading>
                            )}
                            {!isLoading && options.length > 0 && (
                                <CommandGroup>
                                    {options.map((option) => {
                                        const isSelected =
                                            selected?.value === option.value;
                                        return (
                                            <CommandItem
                                                // Cambia el valor a option.value para asegurar unicidad
                                                key={option.value}
                                                value={option.label}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onSelect={() =>
                                                    handleSelectOption(option)
                                                }
                                                className={cn(
                                                    "flex w-full items-center gap-2",
                                                    !isSelected ? "pl-8" : null,
                                                )}
                                            >
                                                {isSelected && (
                                                    <Check className="w-4" />
                                                )}
                                                {/* Muestra la etiqueta dentro del CommandItem */}
                                                {option.label}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}
                            {!isLoading && options.length === 0 && (
                                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                                    {emptyMessage}
                                </CommandPrimitive.Empty>
                            )}
                        </CommandList>
                    </ScrollArea>
                </div>
            </div>
        </CommandPrimitive>
    );
};
