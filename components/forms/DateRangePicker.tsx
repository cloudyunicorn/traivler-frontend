"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineCalendarDays } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isBeforeToday(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return d < today;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [open, setOpen] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Second month for two-month view
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (dateStr: string) => {
    if (isBeforeToday(dateStr)) return;

    if (!selectingEnd) {
      onStartDateChange(dateStr);
      onEndDateChange("");
      setSelectingEnd(true);
    } else {
      if (dateStr <= startDate) {
        onStartDateChange(dateStr);
        onEndDateChange("");
      } else {
        onEndDateChange(dateStr);
        setSelectingEnd(false);
        setOpen(false);
      }
    }
  };

  const isInRange = (dateStr: string) => {
    if (!startDate) return false;
    const effectiveEnd = endDate || hoveredDate;
    if (!effectiveEnd) return false;
    return dateStr > startDate && dateStr < effectiveEnd;
  };

  const isStart = (dateStr: string) => dateStr === startDate;
  const isEnd = (dateStr: string) => dateStr === endDate || (!endDate && selectingEnd && dateStr === hoveredDate);

  const canGoPrev = currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  const nightCount = startDate && endDate
    ? Math.round((new Date(endDate + "T00:00:00").getTime() - new Date(startDate + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  function renderMonth(year: number, month: number) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    return (
      <div className="flex-1 min-w-0">
        {/* Month Title */}
        <div className="text-center text-sm font-semibold text-foreground mb-3">
          {MONTHS[month]} {year}
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={`${month}-${d}`} className="text-center text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${month}-${idx}`} className="h-9" />;
            }
            const dateStr = toDateString(year, month, day);
            const disabled = isBeforeToday(dateStr);
            const start = isStart(dateStr);
            const end = isEnd(dateStr);
            const inRange = isInRange(dateStr);

            return (
              <button
                key={dateStr}
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(dateStr)}
                onMouseEnter={() => selectingEnd && setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={cn(
                  "h-9 w-full text-xs font-medium transition-all relative",
                  disabled && "text-muted-foreground/15 cursor-not-allowed",
                  !disabled && !start && !end && !inRange && "text-foreground/80 hover:bg-accent/10 hover:text-foreground rounded-lg",
                  inRange && "bg-accent/10 text-accent",
                  start && "bg-accent text-white rounded-l-lg shadow-[0_0_12px_rgba(99,102,241,0.4)]",
                  end && "bg-accent text-white rounded-r-lg shadow-[0_0_12px_rgba(99,102,241,0.4)]",
                  start && !endDate && !hoveredDate && "rounded-lg",
                  start && end && "rounded-lg",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      <label className="block text-sm font-medium text-muted-foreground">
        Trip Dates
      </label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-3 h-12 rounded-xl px-4 text-left transition-all",
              "bg-card border border-card-border",
              "hover:border-accent/40",
              open && "border-accent ring-2 ring-accent/20"
            )}
          >
            <HiOutlineCalendarDays className="w-5 h-5 text-accent shrink-0" />
            <div className="flex-1 flex items-center gap-2">
              {startDate ? (
                <>
                  <span className="text-sm font-medium text-foreground">
                    {formatDateDisplay(startDate)}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className={cn(
                    "text-sm font-medium",
                    endDate ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {endDate ? formatDateDisplay(endDate) : "Select end date"}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Select trip dates</span>
              )}
            </div>
            {nightCount > 0 && (
              <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                {nightCount} nights
              </span>
            )}
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-[calc(100vw-1rem)] sm:max-w-[340px] bg-[#0f0f13] border-card-border p-0 gap-0 max-h-[90dvh] overflow-y-auto">
          <DialogHeader className="px-4 pt-5 pb-0">
            <DialogTitle className="text-lg font-semibold text-foreground">
              {selectingEnd ? "Select return date" : "Select departure date"}
            </DialogTitle>
            {startDate && (
              <p className="text-xs text-muted-foreground mt-1">
                {startDate && !endDate && `Departing ${formatDateDisplay(startDate)} · Now pick your return`}
                {startDate && endDate && `${formatDateDisplay(startDate)} → ${formatDateDisplay(endDate)} · ${nightCount} nights`}
              </p>
            )}
          </DialogHeader>

          {/* Navigation */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button
              type="button"
              onClick={goToPrevMonth}
              disabled={!canGoPrev}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-muted-foreground">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Single-Month Calendar Grid */}
          <div className="px-4 pb-4">
            {renderMonth(currentYear, currentMonth)}
          </div>

          {/* Quick Presets */}
          <div className="px-4 pb-5 pt-2 border-t border-card-border flex gap-2 flex-wrap">
            <span className="text-[11px] text-muted-foreground/60 self-center mr-1">Quick:</span>
            {[3, 5, 7, 10, 14].map((n) => {
              const s = new Date();
              s.setDate(s.getDate() + 7);
              const e = new Date(s);
              e.setDate(e.getDate() + n);
              const sStr = toDateString(s.getFullYear(), s.getMonth(), s.getDate());
              const eStr = toDateString(e.getFullYear(), e.getMonth(), e.getDate());
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    onStartDateChange(sStr);
                    onEndDateChange(eStr);
                    setSelectingEnd(false);
                    setOpen(false);
                  }}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-muted-foreground hover:text-accent hover:border-accent/30 hover:bg-accent/10 transition-all"
                >
                  {n} nights
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
