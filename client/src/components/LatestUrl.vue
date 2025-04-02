<template>
  <div class="latest-url-container m-0 rounded">
    <div v-if="loading">Loading latest URLs...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else-if="!latestUrls || latestUrls.length === 0">No URLs have been created yet.</div>
    <div v-else>
      <h2 class="text-2xl mb-3">Latest Shortened URLs</h2>
      <div class="url-list">
        <LatestUrlCard 
          v-for="(url, index) in latestUrls" 
          :key="index" 
          :url="url" 
          :baseUrl="baseUrl"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LatestUrlCard from './LatestUrlCard.vue';

export default {
  name: 'LatestUrls',
  components: {
    LatestUrlCard
  },
  data() {
    return {
      latestUrls: [],
      loading: true,
      error: null,
      baseUrl: window.location.origin
    };
  },
  mounted() {
    this.fetchLatestUrls();
  },
  methods: {
    async fetchLatestUrls() {
      try {
        this.loading = true;
        const response = await axios.get('/api/latest?limit=10');
        this.latestUrls = response.data;
        this.error = null;
      } catch (err) {
        console.error('Error fetching latest URLs:', err);
        if (err.response && err.response.status === 404) {
          // Not an error, just no URLs found
          this.latestUrls = [];
          this.error = null;
        } else {
          this.error = 'Failed to fetch latest URLs';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.latest-url-container {
  background-color: #f8f9fa;
  border-radius: 5px;
  overflow: auto;
}

.url-list {
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr;
}

@media (min-width: 992px) {
  .url-list {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  }
}
</style>
