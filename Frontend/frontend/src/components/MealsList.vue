<template>
  <div>
    <h1>Lista mese</h1>
    <ul>
      <li v-for="meal in meals" :key="meal.id">
        {{ meal.time }} - {{ meal.items.join(', ') }} (Pacient: {{ meal.assignedTo }})
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MealsList',
  computed: {
    ...mapState(['meals']) //mesele din store
  },
  methods: {
    ...mapActions(['fetchMeals']) //  mesele din API
  },
  mounted() {
    this.fetchMeals();
  }
};
</script>
