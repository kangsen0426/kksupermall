<template>
  <div>
      <li :key='item' v-for="item in $store.state.carList">{{item}}</li>
  </div>
</template>

<script>
export default {
    name:'Carlist'
}
</script>

<style>

</style>