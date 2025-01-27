<template>
  <div>
    <h1>Lista pacienti</h1>
    <ul>
      <li v-for="patient in patients" :key="patient.id">
        {{ patient.name }} ({{ patient.id }})
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'PatientsList',
  computed: {
    ...mapState(['patients']) // pac din store
  },
  methods: {
    ...mapActions(['fetchPatients']) // pac din API
  },
  mounted() {
    this.fetchPatients();
  }
};
</script>
