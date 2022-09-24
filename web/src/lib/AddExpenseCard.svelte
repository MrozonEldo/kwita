<script lang='ts'>
    import type * as kwita from '../types';
    
    import { expenses, user, users, expenseCategories }  from '../context';


    let amountDecimal: number = null;
    let title: string;
    let category: kwita.ExpenseCategory;

    function Add(){
        let newExpense: kwita.Expense = {
            id: crypto.randomUUID(),
            amount: amountDecimal*100,
            payer: $user,
            title: title
        }

        $expenses = [newExpense, ...$expenses]
    }
</script>

<div class="box"> 

    Ile:
    <input type="number" bind:value={amountDecimal}>
    <br>
    Tytuł:
    <input type="text" bind:value={title}>
    <br>
    Rodzaj rachunku:
    <select id="categories" bind:value={category}>
        {#each $expenseCategories as c}
            <option value={c}>{c.name}</option>
        {/each}
    </select>
    <br><br>
    <input type="button" value="+" class="add_button" on:click={Add}>
</div>


<style>
    .box{
        padding:30px;
        border:solid black 1px;
    }
    .add_button{
        font-size:150%;
    }
</style>