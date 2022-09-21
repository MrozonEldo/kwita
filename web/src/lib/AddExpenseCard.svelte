<script>
    import {context} from '../context'

    let counter=0;
    let expensesArray =  [
    {
            id: crypto.randomUUID(),
            amount:null,
            payer:null,
            title:null
    }];
    function Add(){
        expensesArray=expensesArray.concat(
            {
                id:crypto.randomUUID(),
                amount:null,
                payer:null,
                title:null
            }
        );
        
        counter++;
        console.log(expensesArray);
    }
</script>

<div class="box"> 
    Kto:
    <select id="users" bind:value={expensesArray[counter].payer}>
        {#each context.users as user}
            <option value={user.name} id="user_name">{user.name}</option>
        {/each}
    </select>
    <br/>
    Ile:
    <input type="text" bind:value={expensesArray[counter].amount}>
    <br>
    Rodzaj rachunku:
    <select id="categories" bind:value={expensesArray[counter].title}>
        {#each context.expenseCategories as category}
            <option value={category.name} id="category_name">{category.name}</option>
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