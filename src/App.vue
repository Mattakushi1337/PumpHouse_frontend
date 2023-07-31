<template>
  <nav>
    <router-link to="/">Дачники</router-link> |
    <router-link to="/create-resident"> Добавить дачника</router-link>|
    <router-link to="/all-periods">Сроки</router-link>| 
    <router-link to="/all-bills">Должники</router-link>

  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #0481f7;
}

nav a.router-link-exact-active {
  color: #5d6461;
}
</style>
