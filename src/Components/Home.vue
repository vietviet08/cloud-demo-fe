<template>
    <div class="app-container">
    <h2>Employee Management</h2>
  </div>
  <div>
    <router-link to="/add" class="add-employee-btn">Add Employee</router-link>
    <DataTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataTable from '../Components/DataTable.vue'
import AddEmployee from '../Components/AddEmp.vue'

export default defineComponent({
    name: "Home",
    components: {
        DataTable,
        AddEmployee
    },
})
</script>
