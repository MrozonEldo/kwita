<script lang='ts'>
    import {users} from '../context'
    import { expenses } from '../context';

</script>

        {#each $users as u}
            <div>
                {u.name}:
                <br>
                Liczba rachunków:0
                <br>
                Suma:
            </div>
        {/each}

<style>
    div{
        border:solid 1px black;
        margin:10px;
        text-align: left;
    }
</style>