<script lang="ts">
  import AddExpenseCard from './lib/AddExpenseCard.svelte';
  import ExpenseCard from './lib/ExpenseCard.svelte';
  import UserList from './lib/UserList.svelte';
  import { expenses }  from './context';

</script>

<main>
  <div class="left">
    <a href="https://github.com/k144/kwita" target="_blank"> 
      <img src="src/assets/k.png" alt="Kwita Logo" class="logo"/>
    </a>
    <h1>Kwita jo</h1>
    <div>
      <UserList/>
    </div>
  </div>

  

  <div class="card">
    <AddExpenseCard/>
    {#each $expenses as expense}
      <ExpenseCard {expense}/>
    {/each}
  </div>
    
</main>

<style>
  .logo{
    height: 100px;
    width: 100px;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  main{
    display: flex;
    justify-content: flex-start;
  }
  .left{
    flex-grow:1;
  }
  .card{
    flex-grow:4;
    flex-direction: column;
    justify-content: center;
  }
</style>
