<script lang='ts'>
    import { formatMoney, formatShortDate } from '../helpers';
    import { expenses } from '../context';
    import type { Expense } from '../types';
    export let expense: Expense;

    function deleteExpense(expense: Expense){
        $expenses=$expenses.filter(e => e.id !== expense.id);
    }
</script>

<div class="expense_card">
    <p>
        {expense.payer.name} zapłacił {formatMoney(expense.amount)} za {expense.title}.
        <br/>Data: {formatShortDate(expense.date)}
    </p>
    <button on:click={()=>deleteExpense(expense)}>USUŃ</button>
</div>

<style>
    .expense_card{
        width:500px;
        border:solid black 1px;
    }
</style>