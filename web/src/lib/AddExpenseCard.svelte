<script lang='ts'>
    import type * as kwita from '../types';
    
    import { expenses, user, users, expenseCategories }  from '../context';


    let amountDecimal: number;
    let title: string;
    let category: kwita.ExpenseCategory;

    function Add(){
        let newExpense: kwita.Expense = {
            id: crypto.randomUUID(),
            date: new Date(),
            amount: amountDecimal*100,
            payer: $user,
            title: title
        }

        $expenses = [newExpense, ...$expenses]
        
    }
</script>

<div class="box"> 
    <form on:submit|preventDefault={Add}>
        Ile:
        <input type="number" bind:value={amountDecimal} required>
        <br>
        Tytuł:
        <input type="text" bind:value={title} required>
        <br>
        Rodzaj rachunku:
        <select id="categories" bind:value={category} required>
            {#each $expenseCategories as c}
                <option value={c}>{c.name}</option>
            {/each}
        </select>
        <br><br>
        <input type="submit" value="+" class="add_button">
    </form>
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