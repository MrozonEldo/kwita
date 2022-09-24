<script lang='ts'>
    import type { Expense, ExpenseCategory } from '../types';
    
    import { expenses, user, users, expenseCategories }  from '../context';


    let amountDecimal: number;
    let title: string;
    let category: ExpenseCategory;
    let payer = $user;

    function Add(){
        let newExpense: Expense = {
            id: crypto.randomUUID(),
            date: new Date(),
            amount: amountDecimal*100,
            payer: payer,
            title: title
        }

        $expenses = [newExpense, ...$expenses]
        
    }
</script>

<div class="box"> 
    <form on:submit|preventDefault={Add}>
        Kto:
        <select class="users" bind:value={payer} required>
            {#each $users as u}
                <option value={u}>{u.name}</option>
            {/each}
        </select>
        Ile:
        <input
            type="number"
            bind:value={amountDecimal}
            step=0.01
            on:input={() => amountDecimal = Math.round(amountDecimal * 100) / 100}
            required>
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