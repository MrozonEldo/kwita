<script>
    //export let id;
    export let amount;
    export let payer;
    export let title;    
</script>

<div class="expense_card">
    <p>Hej {payer}! Chcę ci powiedzieć, że zapłaciłeś {amount} zł za {title}. Spoko ok?</p>
</div>

<style>
    .expense_card{
        width:500px;
        border:solid black 1px;
    }
</style>