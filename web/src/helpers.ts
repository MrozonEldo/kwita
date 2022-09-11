import './types'

let currencyFormater = new Intl.NumberFormat(
    "pl-PL",
    {
        style: "currency",
        currency: "PLN"
    }
    );

export function formatMoney(amount: SMU): string {
    return currencyFormater.format(amount/100)
}