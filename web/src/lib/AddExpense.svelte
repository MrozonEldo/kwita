<script>
    import {users} from '../context'
    import {expenseCategories} from '../context'

</script>

<div class="box"> 
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
    <input type="button" value="+" class="add_button">
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