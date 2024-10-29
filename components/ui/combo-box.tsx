"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import useAppStore from "@/hooks/store/useAppStore"

// Define the type for an item
export interface ComboBoxItem {
  value: string
  label: string
}

// Define the props interface
interface ComboBoxProps {
  items: ComboBoxItem[]
  onItemSelect?: (selectedValue: string) => void,
  disabled?: boolean,
  defaultValue?: string,
}

export function ComboBox({ items, onItemSelect, disabled, defaultValue }: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const handleSelect = (currentValue: string) => {
    const selectedValue = currentValue === value ? "" : currentValue
    setValue(selectedValue)
    setOpen(false)
    if (onItemSelect) {
      onItemSelect(selectedValue)
    }
  }

  React.useEffect(() => {
    if (defaultValue) {
      handleSelect(defaultValue)
    }
  }, [defaultValue])
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
          disabled={disabled}
        >
          {value
            ? items.find((item) => item.label === value)?.label
            : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
