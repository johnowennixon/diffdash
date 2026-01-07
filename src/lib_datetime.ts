import {EMPTY} from "./lib_char_empty.js"
import {COLON, DASH, SPACE} from "./lib_char_punctuation.js"

export const DATETIME_WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const

export function datetime_now(): Date {
  return new Date()
}

export function datetime_now_minus_days(days: number): Date {
  const date = datetime_now()
  date.setDate(date.getDate() - days)
  return date
}

export function datetime_now_plus_days(days: number): Date {
  const date = datetime_now()
  date.setDate(date.getDate() + days)
  return date
}

export function datetime_parse(s: string): Date {
  return new Date(s)
}

export function datetime_parse_timestamp(timestamp: string): Date {
  const year = Number.parseInt(timestamp.slice(0, 4), 10)
  const month_index = Number.parseInt(timestamp.slice(4, 6), 10) - 1
  const day = Number.parseInt(timestamp.slice(6, 8), 10)
  const hours = Number.parseInt(timestamp.slice(8, 10), 10)
  const minutes = Number.parseInt(timestamp.slice(10, 12), 10)
  const seconds = Number.parseInt(timestamp.slice(12, 14), 10)

  const utc = Date.UTC(year, month_index, day, hours, minutes, seconds)
  const date = new Date(utc)

  return date
}

export function datetime_format_utc_iso_ymdthms(date: Date): string {
  return date.toISOString().slice(0, 19)
}

export function datetime_format_utc_iso_ymd_hms(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", SPACE)
}

export function datetime_format_utc_iso_ymd(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function datetime_format_utc_iso_hms(date: Date): string {
  return date.toISOString().slice(11, 19)
}

export function datetime_format_utc_timestamp_alpha(date: Date): string {
  return date.toISOString().slice(0, 19).replaceAll(DASH, EMPTY).replaceAll(COLON, EMPTY) + "Z"
}

export function datetime_format_utc_timestamp_numeric(date: Date): string {
  return date.toISOString().slice(0, 19).replaceAll(DASH, EMPTY).replaceAll(COLON, EMPTY).replace("T", EMPTY)
}

function datetime_localize(date: Date): Date {
  return new Date(date.valueOf() - date.getTimezoneOffset() * 60_000)
}

export function datetime_format_local_iso_ymdthms(date: Date): string {
  return datetime_format_utc_iso_ymdthms(datetime_localize(date))
}

export function datetime_format_local_iso_ymd_hms(date: Date): string {
  return datetime_format_utc_iso_ymd_hms(datetime_localize(date))
}

export function datetime_format_local_iso_ymd(date: Date): string {
  return datetime_format_utc_iso_ymd(datetime_localize(date))
}

export function datetime_format_local_iso_hms(date: Date): string {
  return datetime_format_utc_iso_hms(datetime_localize(date))
}
