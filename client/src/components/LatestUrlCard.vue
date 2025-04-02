<template>
  <div class="github-card">
    <div class="card-header">
      <div class="card-title">
        <span class="card-icon">🔗</span>
        <small>Created: {{ formattedDate }}</small>
      </div>
    </div>
    <div class="card-body">
      <div class="url-info">
        <div class="url-group">
          <div class="url-label">Original URL:</div>
          <div class="url-value">
            <a :href="url.longUrl" target="_blank" rel="noopener noreferrer" class="url-link original-url">
              {{ url.longUrl }}
            </a>
          </div>
        </div>
        
        <div class="url-group">
          <div class="url-label">Shortened URL:</div>
          <div class="url-value">
            <div class="url-with-actions">
              <a :href="`/${url.urlCode}`" target="_blank" rel="noopener noreferrer" class="url-link short-url">
                {{ baseUrl }}/{{ url.urlCode }}
              </a>
              <button class="copy-btn" @click="copyToClipboard(`${baseUrl}/${url.urlCode}`)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
                  <path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="qr-code-container">
        <QRCode :url="`${baseUrl}/${url.urlCode}`" />
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from './QRCode.vue';

export default {
  name: 'LatestUrlCard',
  components: {
    QRCode
  },
  props: {
    url: {
      type: Object,
      required: true
    },
    baseUrl: {
      type: String,
      required: true
    }
  },
  computed: {
    formattedDate() {
      return new Date(this.url.date).toLocaleString();
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          // You could add a toast notification here
          console.log('URL copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
        });
    }
  }
};
</script>

<style scoped>
.github-card {
  background-color: #fff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.card-header {
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  padding: 8px 16px;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #24292f;
}

.card-icon {
  margin-right: 8px;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
}

.url-info {
  flex: 1;
  min-width: 0;
  margin-right: 16px;
}

.url-group {
  margin-bottom: 12px;
}

.url-label {
  font-weight: 600;
  color: #24292f;
  margin-bottom: 4px;
}

.url-value {
  word-break: break-all;
}

.url-link {
  color: #0969da;
  text-decoration: none;
}

.url-link:hover {
  text-decoration: underline;
}

.original-url {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.url-with-actions {
  display: flex;
  align-items: center;
  background-color: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 6px 12px;
}

.short-url {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: #57606a;
  padding: 4px;
  margin-left: 8px;
  cursor: pointer;
  border-radius: 4px;
}

.copy-btn:hover {
  color: #0969da;
  background-color: #ddf4ff;
}

.qr-code-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

@media (max-width: 768px) {
  .card-body {
    flex-direction: column;
  }
  
  .url-info {
    margin-right: 0;
    margin-bottom: 16px;
    width: 100%;
  }
  
  .qr-code-container {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
