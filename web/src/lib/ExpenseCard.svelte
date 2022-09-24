<script>
    import { formatMoney,formatShortDate } from '../helpers';
    import { expenses } from '../context';
    export let expense;

    function Delete(e){
        $expenses=$expenses.filter(item => item.id !== e);
    }
</script>

<div class="expense_card">
    <p>{expense.payer.name} zapłacił {formatMoney(expense.amount)} za {expense.title}.<br/>Data:{formatShortDate(expense.date)}</p>
    <input type="button" value="USUŃ" on:click={()=>Delete(expense.id)}>
</div>

<style>
    .expense_card{
        width:500px;
        border:solid black 1px;
    }
</style>