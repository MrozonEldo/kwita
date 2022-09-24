<script lang="ts">
  import AddExpenseCard from './lib/AddExpenseCard.svelte'
  import ExpenseCard from './lib/ExpenseCard.svelte';
  import { expenses }  from './context';

</script>

<main>
  <div>
    <a href="https://github.com/k144/kwita" target="_blank"> 
      <img src="src/assets/k.png" alt="Kwita Logo" class="logo"/>
    </a>
  </div>
  <h1>Kwita jo</h1>

  <div class="card">
    <AddExpenseCard/>
  </div>
    {#each $expenses as expense}
      <ExpenseCard {expense}/>
    {/each}
  <div>
    
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
</style>
