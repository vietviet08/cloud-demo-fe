<template>
  <div class="data-table-wrapper">
    <div class="table-card">
      <div class="table-header">
        <h3 class="table-title">Employees List</h3>
        <span class="employee-count">{{ emps.length }} employee{{ emps.length !== 1 ? 's' : '' }}</span>
      </div>
      <div class="table-container">
        <table class="custom-table" v-if="emps.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in emps" :key="item.id" class="table-row">
              <td class="id-cell">{{ item.id }}</td>
              <td class="name-cell">
                <div class="name-wrapper">
                  <div class="avatar">{{ item.name.charAt(0).toUpperCase() }}</div>
                  <span>{{ item.name }}</span>
                </div>
              </td>
              <td class="salary-cell">${{ formatSalary(item.salary) }}</td>
              <td class="date-cell">{{ formatDate(item.createdAt) }}</td>
              <td class="date-cell">{{ formatDate(item.updatedAt) }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <router-link :to="`/edit/${item.id}`" class="edit-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.68601 11.9448 1.59131C12.1734 1.49661 12.4178 1.44803 12.6667 1.44803C12.9155 1.44803 13.1599 1.49661 13.3884 1.59131C13.617 1.68601 13.8249 1.82491 14 2.00001C14.1751 2.1751 14.314 2.38305 14.4087 2.61158C14.5034 2.8401 14.552 3.08454 14.552 3.33334C14.552 3.58214 14.5034 3.82658 14.4087 4.0551C14.314 4.28363 14.1751 4.49158 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Edit
                  </router-link>
                  <button class="delete-btn" @click="confirmDelete(item.id, item.name)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V13.3333C12 14 11.3333 14.6667 10.6667 14.6667H5.33333C4.66667 14.6667 4 14 4 13.3333V4M13.3333 4H2.66667M10 4V2.66667C10 2 9.33333 1.33333 8.66667 1.33333H7.33333C6.66667 1.33333 6 2 6 2.66667V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" v-else>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="38" stroke="#cbd5e0" stroke-width="2"/>
            <path d="M40 25V45M25 35H55" stroke="#cbd5e0" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h3>No employees yet</h3>
          <p>Get started by adding your first employee</p>
          <router-link to="/add" class="empty-add-btn">Add Employee</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from "axios";

export default defineComponent({
  name: "DataTable",
  data() {
    return {
      emps: [] as any,
      base_url: "https://catcosy.shop",
    };
  },
  mounted() {
    this.getAllEmployees();
  },
  methods:{
    async getAllEmployees(){
      try {
        const response = await axios.get(`${this.base_url}/employees/all`);
        this.emps = response.data
        console.log('Employees loaded:', response.data)
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    },
    async deleteEmp(userId: Number){
      try {
        await axios.delete(`${this.base_url}/employees/delete/${userId}`);
        this.getAllEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    },
    confirmDelete(userId: Number, name: string) {
      if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
        this.deleteEmp(userId);
      }
    },
    formatSalary(salary: number): string {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(salary);
    },
    formatDate(dateString: string): string {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      } catch {
        return dateString;
      }
    }
  },
});
</script>

<style scoped>
.data-table-wrapper {
  width: 100%;
}

.table-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.table-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.table-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.table-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

.employee-count {
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.custom-table thead {
  background: #f7fafc;
}

.custom-table th {
  padding: 16px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.custom-table th.actions-column {
  text-align: center;
}

.custom-table td {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  color: #2d3748;
  vertical-align: middle;
}

.custom-table tbody tr {
  transition: all 0.2s ease;
}

.custom-table tbody tr:hover {
  background: #f7fafc;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

.id-cell {
  font-weight: 600;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.name-cell {
  font-weight: 500;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.salary-cell {
  font-weight: 600;
  color: #10b981;
  font-size: 15px;
}

.date-cell {
  color: #718096;
  font-size: 13px;
}

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #dbeafe;
  color: #2563eb;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.edit-btn:hover {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transform: translateY(-2px);
}

.edit-btn:active {
  transform: translateY(0);
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #dc2626;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  transform: translateY(-2px);
}

.delete-btn:active {
  transform: translateY(0);
}

.empty-state {
  padding: 80px 40px;
  text-align: center;
  color: #718096;
}

.empty-state svg {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #4a5568;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #718096;
}

.empty-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.empty-add-btn:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .table-header {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .table-card {
    border-radius: 12px;
  }

  .custom-table th,
  .custom-table td {
    padding: 12px 16px;
    font-size: 13px;
  }

  .custom-table th {
    font-size: 11px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .date-cell {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .table-container {
    overflow-x: scroll;
  }

  .custom-table {
    min-width: 800px;
  }
}
</style>
