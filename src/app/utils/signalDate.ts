export const getTodayDateInput = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayDateTimeLocal = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const toDateInputValue = (value?: string | Date | null): string => {
  if (!value) return getTodayDateInput();

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return getTodayDateInput();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const toDateTimeLocalValue = (value?: string | Date | null): string => {
  if (!value) return getTodayDateTimeLocal();

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return getTodayDateTimeLocal();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const dateInputToIso = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString();

  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return new Date().toISOString();

  return new Date(year, month - 1, day, 12, 0, 0, 0).toISOString();
};

export const formatSignalDateLabel = (value?: string | Date) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getTodaySignalDateIso = () => dateInputToIso(getTodayDateInput());
