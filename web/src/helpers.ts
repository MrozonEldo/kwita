import type { SMU } from './types'
const locale = "pl-PL"
const currencyFormater = new Intl.NumberFormat(
    locale,
    {
        style: "currency",
        currency: "PLN"
    }
    );

const shortDateFormater = new Intl.DateTimeFormat(locale, {
    dateStyle: "short"
  });

export function formatMoney(amount: SMU): string {
    return currencyFormater.format(amount/100)
}

export function formatShortDate(date: Date): string {
    return shortDateFormater.format(date)
}