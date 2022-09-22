<script>
    //export let id;
    import { formatMoney } from '../helpers';
    export let expense;

    function Delete(id){
        const valueToRemove = Object.values(id);
        console.log(valueToRemove[0]);
        expense=expense.filter(item => item.id !== valueToRemove[0]);
        console.log(expense);
    }
</script>

<div class="expense_card">
    <p>Hej {expense.payer.name}! Chcę ci powiedzieć, że zapłaciłeś {formatMoney(expense.amount)} za {expense.title}. Spoko ok?</p>
    <input type="button" value="USUŃ" on:click={()=>Delete(expense)}>
</div>

<style>
    .expense_card{
        width:500px;
        border:solid black 1px;
    }
</style>