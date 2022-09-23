<script>
    //export let id;
    import { formatMoney } from '../helpers';
    import { expenses } from '../context';
    export let expense;

    function Delete(e){
        console.log(e);
        $expenses=$expenses.filter(item => item.id !== e);
        console.log(expenses);
    }
</script>

<div class="expense_card">
    <p>Hej {expense.payer.name}! Chcę ci powiedzieć, że zapłaciłeś {formatMoney(expense.amount)} za {expense.title}. Spoko ok?</p>
    <input type="button" value="USUŃ" on:click={()=>Delete(expense.id)}>
</div>

<style>
    .expense_card{
        width:500px;
        border:solid black 1px;
    }
</style>