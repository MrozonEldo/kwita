<script lang="ts">
  import AddExpense from './lib/AddExpense.svelte'
  import { formatMoney } from './helpers'
  console.log(formatMoney(1234));
</script>

<main>
  <div>
    <a href="https://github.com/k144/kwita" target="_blank"> 
      <img src="src/assets/k.png" alt="Kwita Logo" class="logo"/>
    </a>
  </div>
  <h1>Kwita jo</h1>

  <div class="card">
    <AddExpense/>
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
