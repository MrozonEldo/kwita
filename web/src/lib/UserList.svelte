<script lang='ts'>
    import { users, expenses } from '../context'
    import { formatMoney } from '../helpers';

    function oblicz(){

        let totalOfExpenses = [];
        let mean = $expenses.reduce((a, b) => a + b.amount, 0) / $users.length;
        for (let user of $users) {
            totalOfExpenses.push({
                user: user,
                total: $expenses.filter(e => e.payer.id == user.id)
                        .reduce((a, b) => a + b.amount, 0),
                balance: 0
            })
        }
        
        for (let object of totalOfExpenses){
            object.balance=mean-object.total;
        }
        totalOfExpenses.sort((a,b) => b.balance - a.balance);

        while(totalOfExpenses.length >= 2){
            
            let min = totalOfExpenses[totalOfExpenses.length-1];
            let max = totalOfExpenses[0];
    
            if (max.balance > Math.abs(min.balance)) {
                console.log(max.user.name + ' | ' + formatMoney(Math.abs(min.balance)) + ' => ' + min.user.name);
                max.balance += min.balance;
                min.balance = 0;
            } else {
                console.log(max.user.name + ' | ' + formatMoney(max.balance) + ' => ' + min.user.name);
                min.balance += max.balance;
                max.balance = 0;
            }
            totalOfExpenses = totalOfExpenses.filter(e => e.balance !== 0);

        }
        
    }
</script>

        {#each $users as u}
            <div>
                {u.name}:
                <br>
                Liczba rachunków: { $expenses.filter(e => e.payer.id == u.id).length }
                <br>
                Suma: {
                    formatMoney($expenses
                        .filter(e => e.payer.id == u.id)
                        .reduce((a, b) => a + b.amount, 0))
                }
            </div>
        {/each}

        <input type="button" value="OBLICZ" on:click={oblicz}>
        <div id="wynik"></div>

<style>
    div{
        border:solid 1px black;
        margin:10px;
        text-align: left;
    }
</style>