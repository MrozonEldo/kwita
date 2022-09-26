<script lang='ts'>
    import { users, expenses } from '../context'
    import { formatMoney } from '../helpers';

    let totalsOfExpenses=$expenses;
</script>

        {#each $users as u}
            <div>
                {u.name}:
                <br>
                Liczba rachunków: { $expenses.filter(e => e.payer.id == u.id).length }
                <br>
                Suma: {
                    totalsOfExpenses=$expenses.filter(e => e.payer.id == u.id),
                    formatMoney(totalsOfExpenses.reduce((a,b) => a + b.amount,0))
                }
            </div>
        {/each}

<style>
    div{
        border:solid 1px black;
        margin:10px;
        text-align: left;
    }
</style>