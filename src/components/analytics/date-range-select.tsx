"use client";

import { CalendarDays } from "lucide-react";

import { ranges, type RangeKey } from "@/lib/metricool";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DateRangeSelectProps = {
  value: RangeKey;
  onChange: (value: RangeKey) => void;
};

export function DateRangeSelect({ value, onChange }: DateRangeSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as RangeKey)}>
      <SelectTrigger className="w-[180px]" aria-label="Select date range">
        <CalendarDays className="size-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ranges.map((r) => (
          <SelectItem key={r.key} value={r.key}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
