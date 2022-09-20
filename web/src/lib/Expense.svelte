<script>
    import {users} from '../context'
    import {expenseCategories} from '../context'

    export var testa =[];
    function Add(){
        testa=testa.concat({id:1,name:"tomek"});
        console.log(testa);
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

{#each testa as a}
    <div class="exist_expense">{a.id} imie: {a.name}</div>
{/each}

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