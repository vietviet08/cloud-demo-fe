<template>
  <div class="form-wrapper">
    <div class="form-card">
      <div class="form-header">
        <div class="header-icon">
          <svg v-if="mode === 'Add'" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8V24M8 16H24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2.5"/>
          </svg>
          <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.6667 10L12 20.6667L9.33333 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2.5"/>
          </svg>
        </div>
        <h2 class="form-title">{{ mode === 'Add' ? 'Add New Employee' : 'Update Employee' }}</h2>
        <p class="form-subtitle">{{ mode === 'Add' ? 'Fill in the details to add a new employee to the system' : 'Update the employee information below' }}</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label class="form-label" for="employee-name">
            Full Name
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="currentColor"/>
              <path d="M10 12.5C5.58172 12.5 2 15.0294 2 18.3333V20H18V18.3333C18 15.0294 14.4183 12.5 10 12.5Z" fill="currentColor"/>
            </svg>
            <input
              id="employee-name"
              v-model="name"
              class="form-input"
              :class="{ 'input-error': error && !name }"
              type="text"
              placeholder="Enter employee full name"
              required
              aria-required="true"
              @input="clearError"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="employee-salary">
            Salary
            <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="currentColor"/>
            </svg>
            <input
              id="employee-salary"
              v-model.number="salary"
              class="form-input"
              :class="{ 'input-error': error && (!salary || Number(salary) <= 0) }"
              type="number"
              placeholder="Enter salary amount"
              min="0"
              step="0.01"
              @input="clearError"
            >
          </div>
          <span class="input-hint">Enter the salary in dollars (e.g., 50000)</span>
        </div>

        <div class="error-message" v-if="error">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ error }}
        </div>

        <div class="form-actions">
          <router-link to="/" class="cancel-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Cancel
          </router-link>
          <button class="submit-btn" @click="saveEmployee" :disabled="!!loading">
            <svg v-if="!loading" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" fill="currentColor"/>
            </svg>
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Processing...' : (mode === 'Add' ? 'Add Employee' : 'Update Employee') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
    name:"AddEditEmployee",
    data(){
        return {
            name: '' as String,
            salary: 0 as Number,
            error: '',
            mode: 'Add',
            employeeId: null as any,
            base_url: "http://18.141.170.131:8080",
            loading: false,
        };
    },
    computed: {
        isAddMode() {
        return this.mode === "Add";
        },
    },
    watch: {
        $route(to) {
        this.employeeId = to.params.employeeId;
        this.mode = this.employeeId ? "Edit" : "Add";
        this.initializeForm();
        },
  },
  created() {
    this.employeeId = this.$route.params.employeeId as string | undefined;
    this.mode = this.employeeId ? "Edit" : "Add";
    this.initializeForm();
  },
  beforeRouteUpdate(to, _from, next) {
    this.employeeId = to.params.employeeId;
    this.mode = this.employeeId ? "Edit" : "Add";
    this.initializeForm();
    next();
    },
  beforeMount() {
    this.initializeForm();
  },
    methods: {
        async loadExistingData() {
      if (!this.employeeId) return;
      
      try {
        const response = await axios.get(`${this.base_url}/employees/${this.employeeId}`);
        this.name = response.data.name;
        this.salary = response.data.salary;
      } catch (error: any) {
        this.error = "Error loading employee data: " + error.message;
      }
    },
    initializeForm() {
        if (this.mode === "Add") {
        this.name = "";
        this.salary = 0;
      } else if (this.mode === "Edit") {
        this.loadExistingData();
      }
    },
    clearError() {
      this.error = '';
    },
    async saveEmployee() {
        this.error = '';
        
        if (!this.name || this.name.trim() === '') {
            this.error = 'Employee name is required';
            return;
        }
        
        if (!this.salary || Number(this.salary) <= 0) {
            this.error = 'Please enter a valid salary amount';
            return;
        }
        
      this.loading = true;
      const employeeData = {
        name: this.name.trim(),
        salary: this.salary,
      };
      
      if (this.mode === 'Add'){
        try {
        await axios.post(`${this.base_url}/employees/create`, employeeData);
        this.name = '';
        this.salary = 0;
        this.loading = false;
        window.location.href = '/';
        } catch (error: any) {
            this.loading = false;
            this.error = 'Error adding employee: ' + (error.response?.data?.message || error.message);
        }
      } else {
        try {
        const response = await axios.put(`${this.base_url}/employees/update/${this.employeeId}`, employeeData);
        console.log('Employee updated:', response.data);
        this.name = '';
        this.salary = 0;
        this.loading = false;
        window.location.href = '/';
      } catch (error: any) {
        this.loading = false;
        this.error = 'Error updating employee: ' + (error.response?.data?.message || error.message);
      }
      }
    },
  },
})
</script>
<style scoped>
.form-wrapper {
  min-height: 100vh;
  padding: 40px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 40px 32px;
  text-align: center;
  color: #ffffff;
}

.header-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.form-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
}

.form-subtitle {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.form-body {
  padding: 40px;
}

.form-group {
  margin-bottom: 28px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #a0aec0;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: #2d3748;
  background: #ffffff;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input.input-error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-input::placeholder {
  color: #a0aec0;
}

.input-hint {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #718096;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.error-message svg {
  flex-shrink: 0;
  color: #dc2626;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.cancel-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: #f7fafc;
  color: #4a5568;
  text-decoration: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .form-wrapper {
    padding: 24px 16px;
  }

  .form-header {
    padding: 32px 24px 24px;
  }

  .form-body {
    padding: 32px 24px;
  }

  .form-title {
    font-size: 24px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    flex: 1;
    width: 100%;
  }
}
</style>