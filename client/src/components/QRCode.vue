<template>
  <div class="qr-code-container">
    <img 
      :src="qrCode" 
      alt="QR Code" 
      class="qr-code-thumbnail"
      @click="showDialog = true"
      title="Click to enlarge QR code"
    />
    
    <!-- QR Code Dialog -->
    <div v-if="showDialog" class="qr-code-dialog" @click="showDialog = false">
      <div class="qr-code-dialog-content" @click.stop>
        <div class="qr-code-dialog-header">
          <h5 class="m-0">Scan QR Code</h5>
          <button class="close-button" @click="showDialog = false">&times;</button>
        </div>
        <div class="qr-code-dialog-body">
          <img :src="qrCode" alt="QR Code" class="qr-code-large" />
          <p class="mt-2 text-center">{{ url }}</p>
          <button class="copy-button" @click="copyUrlToClipboard">
            <span v-if="copied">Copied!</span>
            <span v-else>Copy URL</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'QRCode',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      qrCode: null,
      showDialog: false,
      copied: false
    };
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    async generateQRCode() {
      try {
        // Generate QR code using qrcode.js library
        this.qrCode = await QRCode.toDataURL(this.url, {
          width: 150,
          margin: 1,
          color: {
            dark: '#000',
            light: '#fff'
          }
        });
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    },
    async copyUrlToClipboard() {
      try {
        await navigator.clipboard.writeText(this.url);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  }
};
</script>

<style scoped>
.qr-code-container {
  display: inline-block;
}

.qr-code-thumbnail {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: transform 0.2s;
}

.qr-code-thumbnail:hover {
  transform: scale(1.05);
}

.qr-code-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.qr-code-dialog-content {
  background: white;
  border-radius: 6px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
  border: 1px solid #d0d7de;
}

.qr-code-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #d0d7de;
  background-color: #f6f8fa;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #57606a;
  padding: 0;
  line-height: 1;
}

.qr-code-dialog-body {
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code-large {
  width: 200px;
  height: 200px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
}

.copy-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  color: #24292f;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 200px;
}

.copy-button:hover {
  background-color: #f3f4f6;
  border-color: #bbc0c6;
}
</style>
