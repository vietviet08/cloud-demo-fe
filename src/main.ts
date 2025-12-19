import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Config/Router'

// Create and mount app
const app = createApp(App);
app.use(router);

// Mount app
app.mount("#app");

// Navigate to home route
router.isReady().then(() => {
  router.push('/').catch((err) => {
    console.error('Navigation error:', err);
  });
});
