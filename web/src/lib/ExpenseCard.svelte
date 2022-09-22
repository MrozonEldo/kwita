<script>
    //export let id;
    import { formatMoney } from '../helpers';
    export let expense;

</script>

<div class="expense_card">
    <p>Hej {expense.payer.name}! Chcę ci powiedzieć, że zapłaciłeś {formatMoney(expense.amount)} za {expense.title}. Spoko ok?</p>
</div>

<style>
    .expense_card{
        width:500px;
        border:solid black 1px;
    }
</style>