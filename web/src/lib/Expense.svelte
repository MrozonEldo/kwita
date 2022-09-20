<script>
    import { identity } from 'svelte/internal';
    import {users} from '../context'
    import {expenseCategories} from '../context'

    var receipts =[];
    let count=0;
    function Add(){
        receipts=receipts.concat({id:count,name:"tomek",notExist:false});
        count++;
        console.log(receipts);
    }
    function Delete(){
        receipts=receipts.filter(r => !r.exist);
        console.log(receipts);
    }
</script>

<div class="add_expense"> 
    Kto:
    <select id="users">
        {#each users as user}
            <option value={user.name} id="user_name">{user.name}</option>
        {/each}
    </select>
    <br/>
    Ile:
    <input type="text" id="bill">
    <br>
    Rodzaj rachunku:
    <select id="category">
        {#each expenseCategories as category}
            <option value={category.name} id="category">{category.name}</option>
        {/each}
    </select>
    <br><br>
    <input type="button" value="+" class="add_button" on:click={Add}>
</div>

{#each receipts as a}
    <div class="exist_expense">
        {a.id} <br/>
        imie: {a.name} <br/>
        <input type=checkbox bind:checked={a.exist}>
    </div>
{/each}

<br/>
<input type="button" value="-" class="add_button" on:click={Delete}>

<style>
    .add_expense{
        padding:30px;
        border:solid black 1px;
    }
    .add_button{
        font-size:150%;

    }
    .exist_expense{
        padding:30px;
        border:solid black 1px;
    }
</style>