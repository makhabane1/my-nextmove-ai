import { useMemo, useRef, useState } from "react";

import { SA_CITIES, findCity } from "../lib/sa-cities";
import { zar } from "../lib/nextmove-schema";

type Props = {
  value: string;
  onChange: (city: string) => void;
  label?: string;
};

/** Searchable South African city picker. The choice feeds cost-of-living into the simulation. */
export function CitySelect({ value, onChange, label = "Your city" }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SA_CITIES;
    return SA_CITIES.filter(
      (c) => c.city.toLowerCase().includes(q) || c.province.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = findCity(value);

  return (
    <div className="relative">
      <label
        htmlFor="city-search"
        className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase"
      >
        {label}
      </label>
      <input
        id="city-search"
        role="combobox"
        aria-expanded={open}
        aria-controls="city-options"
        autoComplete="off"
        value={open ? query : selected ? selected.city : query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        placeholder="Search a South African city"
        className="border-ink/15 focus:border-volt mt-2 w-full border bg-transparent p-3 text-base outline-none"
      />

      {open && (
        <ul
          id="city-options"
          className="border-ink/15 bg-card text-card-foreground absolute z-20 mt-1 max-h-64 w-full overflow-auto border shadow-lg"
        >
          {results.length === 0 && (
            <li className="text-muted-foreground p-3 text-sm">No matching city yet.</li>
          )}
          {results.map((c) => (
            <li key={c.city}>
              <button
                type="button"
                onMouseDown={() => {
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  onChange(c.city);
                  setQuery("");
                  setOpen(false);
                }}
                className="hover:bg-volt hover:text-ink flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm transition-colors"
              >
                <span className="font-semibold">{c.city}</span>
                <span className="text-xs opacity-70">
                  {c.province} · rent ~{zar(c.rent)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && !open && (
        <p className="text-muted-foreground mt-2 text-xs">
          Using {selected.city} figures: rent ~{zar(selected.rent)}, transport ~
          {zar(selected.transport)}, food ~{zar(selected.food)} a month.
        </p>
      )}
    </div>
  );
}
