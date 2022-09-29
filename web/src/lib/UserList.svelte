<script lang='ts'>
    import { users, expenses } from '../context'
    import { formatMoney } from '../helpers';

    function oblicz(){

        let totalOfExpenses = [];
        let mean = $expenses.reduce((a, b) => a + b.amount, 0)/3;
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

        while(totalOfExpenses.length != 0){
            
            totalOfExpenses=totalOfExpenses.filter(e => e.balance !==0);

           if(totalOfExpenses[0].balance > Math.abs(totalOfExpenses[totalOfExpenses.length-1].balance)){

                console.log(totalOfExpenses[0].user.name + ' | ' + formatMoney(Math.abs(totalOfExpenses[totalOfExpenses.length-1].balance)) + ' => ' + totalOfExpenses[totalOfExpenses.length-1].user.name);

                totalOfExpenses[0].balance += (totalOfExpenses[totalOfExpenses.length-1].balance);

                totalOfExpenses[totalOfExpenses.length-1].balance=0;
            }

            else if(totalOfExpenses[0].balance <= Math.abs(totalOfExpenses[totalOfExpenses.length-1].balance)){

                console.log(totalOfExpenses[0].user.name + ' | ' + formatMoney(totalOfExpenses[0].balance) + ' => ' + totalOfExpenses[totalOfExpenses.length-1].user.name);

                totalOfExpenses[totalOfExpenses.length-1].balance += totalOfExpenses[0].balance;

                totalOfExpenses[0].balance=0;
            }

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