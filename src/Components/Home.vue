<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">Employee Management System</h1>
          <p class="subtitle">Manage your workforce efficiently</p>
        </div>
        <router-link to="/add" class="add-employee-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add New Employee
        </router-link>
      </div>
    </div>
    <div class="home-content">
      <DataTable />
    </div>
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

<style scoped>
.home-wrapper {
  min-height: 100vh;
  padding: 0;
}

.home-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 40px 60px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.main-title {
  margin: 0 0 8px 0;
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.home-content {
  max-width: 1400px;
  margin: -40px auto 40px;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .home-header {
    padding: 30px 24px 50px;
  }

  .home-content {
    padding: 0 24px;
    margin-top: -30px;
  }

  .main-title {
    font-size: 28px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
