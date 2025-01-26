<template>
  <div>
    <nav>
      <router-link to="/patients">Pacienti</router-link> |
      <router-link to="/meals">Mese</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  font-weight: bold;
  color: #42b983;
}
nav a.router-link-exact-active {
  color: #35495e;
}
</style>
