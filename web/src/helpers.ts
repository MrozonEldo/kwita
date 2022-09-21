import * as kwita from './types'

let currencyFormater = new Intl.NumberFormat(
    "pl-PL",
    {
        style: "currency",
        currency: "PLN"
    }
    );

export function formatMoney(amount: kwita.SMU): string {
    return currencyFormater.format(amount/100)
}