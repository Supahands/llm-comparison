import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  characterLimit?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, characterLimit, value, defaultValue, ...props }, ref) => {
    const [error, setError] = React.useState(false);
    const [charCount, setCharCount] = React.useState(() => {
      return String(value || defaultValue || "").length;
    });
    
    React.useEffect(() => {
      if (value !== undefined) {
        const newCharCount = String(value).length;
        setCharCount(newCharCount);
        
        if (characterLimit) {
          if (newCharCount >= characterLimit && !error) {
            setError(true);
          } else if (newCharCount < characterLimit && error) {
            setError(false);
          }
        }
      }
    }, [value, characterLimit, error]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if (characterLimit && charCount >= characterLimit) {
        setError(true);
        e.target.value = value.slice(0, characterLimit);
        setCharCount(characterLimit);
      } else {
        setError(value.length === characterLimit);
        setCharCount(value.length);
      }
      
      // Call the original onChange if it exists
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full flex flex-col">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-input focus-visible:ring-ring",
            className
          )}
          ref={ref}
          onChange={handleChange}
          maxLength={characterLimit}
          {...props}
        />
        {characterLimit && (
          <motion.div 
            className={cn(
              "text-xs text-right mt-1",
              error ? "text-red-500" : "text-muted-foreground"
            )}
            animate={error ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 }
            } : {}}
            key={error ? "error" : "normal"}
          >
            {charCount}/{characterLimit}
          </motion.div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input };
