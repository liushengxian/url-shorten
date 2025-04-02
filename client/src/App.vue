<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pb-16">
    <div class="mx-auto">
      <h1 class="text-3xl font-bold text-center text-indigo-600 mb-6">URL Shortener</h1>
      <div class="space-y-4">
        <input
          type="text"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter URL to shorten"
          v-model="longUrl"
        />
        <button 
          class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="handleSubmit"
        >
          Shorten
        </button>
      </div>
      
      <!-- Display any result/error messages -->
      <div class="mt-4 p-4 rounded-md bg-green-50 border border-green-200" v-if="shortUrl">
        <div class="flex items-center justify-between">
          <p class="text-green-800">
            Shortened URL: 
            <a :href="shortUrl" class="text-indigo-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              {{ shortUrl }}
            </a>
          </p>
          <QRCode :url="shortUrl" />
        </div>
      </div>
      
      <div class="mt-4 p-4 rounded-md bg-red-50 border border-red-200" v-if="error">
        <p class="text-red-800">{{ error }}</p>
      </div>
      
      <!-- Latest URL component -->
      <LatestUrl class="mt-8" />
    </div>
  </div>
  <!-- Fixed Footer -->
  <footer class="py-3 bg-gray-100 border-t border-gray-200 text-center text-gray-600">
    Made with ❤️ by Shawn.
  </footer>
</template>

<script>
import axios from 'axios';
import LatestUrl from './components/LatestUrl.vue';
import QRCode from './components/QRCode.vue';

export default {
  name: 'App',
  components: {
    LatestUrl,
    QRCode
  },
  data() {
    return {
      longUrl: '',
      shortUrl: '',
      error: ''
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.longUrl) {
        this.error = 'Please enter a URL';
        return;
      }
      
      try {
        this.error = '';
        const response = await axios.post('/api/url/shorten', { longUrl: this.longUrl });
        this.shortUrl = `${window.location.origin}/${response.data.urlCode}`;
        this.longUrl = '';
      } catch (err) {
        this.error = err.response?.data?.message || 'An error occurred';
        console.error('Error shortening URL:', err);
      }
    }
  }
};
</script>

<style>
/* Tailwind is used with utility classes directly in the template */
</style>
