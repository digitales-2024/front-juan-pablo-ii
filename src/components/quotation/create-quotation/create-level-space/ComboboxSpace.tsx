import { Spaces } from "@/types";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import React from "react";

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

interface ComboboxProps {
    dataSpacesAll: Spaces[];
    value: string;
    setValue: (value: string) => void;
}

const ComboboxTrigger: React.FC<{ open: boolean; value: string }> = ({
    open,
    value,
}) => (
    <PopoverTrigger asChild>
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
        >
            {value || "Selecciona un ambiente..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    </PopoverTrigger>
);

const ComboboxContent: React.FC<{
    dataSpacesAll: Spaces[];
    value: string;
    setValue: (value: string) => void;
    setOpen: (open: boolean) => void;
}> = ({ dataSpacesAll, value, setValue, setOpen }) => (
    <PopoverContent className="w-[200px] p-0">
        <Command>
            <CommandInput placeholder="Buscar ambientes..." className="h-9" />
            <CommandList>
                <CommandEmpty>No se encontró ningún ambiente.</CommandEmpty>
                <CommandGroup>
                    {dataSpacesAll.map((space) => (
                        <ComboboxItem
                            key={space.id}
                            space={space}
                            value={value}
                            setValue={setValue}
                            setOpen={setOpen}
                        />
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    </PopoverContent>
);

const ComboboxItem: React.FC<{
    space: Spaces;
    value: string;
    setValue: (value: string) => void;
    setOpen: (open: boolean) => void;
}> = ({ space, value, setValue, setOpen }) => (
    <CommandItem
        value={space.name}
        onSelect={(currentValue) => {
            setValue(currentValue);
            setOpen(false);
        }}
    >
        {space.name}
        <CheckIcon
            className={`ml-auto h-4 w-4 ${value === space.name ? "opacity-100" : "opacity-0"}`}
        />
    </CommandItem>
);

export const Combobox: React.FC<ComboboxProps> = ({
    dataSpacesAll,
    value,
    setValue,
}) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <ComboboxTrigger open={open} value={value} />
            <ComboboxContent
                dataSpacesAll={dataSpacesAll}
                value={value}
                setValue={setValue}
                setOpen={setOpen}
            />
        </Popover>
    );
};
