import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export interface SearchableDropdownOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface SearchableDropdownProps {
  id?: string;
  label?: React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  options: SearchableDropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  id,
  label,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  options,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    setSearch("");
  };

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.subLabel &&
        opt.subLabel.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div
      className={`flex flex-col gap-1 relative w-full ${className}`}
      ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        className={`w-full px-3 py-2 rounded-lg bg-slate-900 border text-left text-xs flex items-center justify-between transition-colors ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-slate-700 hover:border-slate-600 focus:border-indigo-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
        <span
          className={`truncate ${
            selectedOption ? "text-slate-100 font-medium" : "text-slate-400"
          }`}>
          {selectedOption
            ? selectedOption?.subLabel
              ? `${selectedOption?.label} (${selectedOption?.subLabel})`
              : selectedOption?.label
            : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-100">
          <div className="p-2 border-b border-slate-800 bg-slate-950/60 flex items-center gap-1.5">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar p-1 flex flex-col gap-0.5">
            {filteredOptions?.map((opt) => {
              const isSelected = opt?.value === value;
              return (
                <button
                  key={opt?.value}
                  type="button"
                  onClick={() => {
                    onChange(opt?.value);
                    handleClose();
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-md text-left text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}>
                  <div className="truncate flex items-center gap-1">
                    <span className="truncate">{opt?.label}</span>
                    {opt?.subLabel && (
                      <span className="text-[11px] text-slate-400 truncate">
                        ({opt?.subLabel})
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check size={13} className="text-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}

            {filteredOptions?.length === 0 && (
              <div className="px-3 py-2 text-center text-[11px] text-slate-500">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}

      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  );
};
