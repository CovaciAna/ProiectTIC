<template>
  <div v-if="visible" class="message-box-overlay">
    <div class="message-box">
      <p class="message-text">{{ message }}</p>
      <div class="message-buttons">
        <button
          v-if="type === 'question'"
          @click="confirm"
          class="gradient-button"
        >
          Da
        </button>
        <button
          v-if="type === 'question'"
          @click="cancel"
          class="gradient-button delete-button"
        >
          Nu
        </button>
        <button
          v-if="type === 'alert'"
          @click="close"
          class="gradient-button"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    type: {
      type: String,
      default: "alert" 
    }
  },
  data() {
    return {
      visible: true
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit("closed");
    },
    confirm() {
      this.$emit("confirmed");
      this.visible = false;
    },
    cancel() {
      this.$emit("canceled");
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.message-box-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.message-box {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Roboto', sans-serif;
  max-width: 400px;
  width: 90%;
}

.message-text {
  font-size: 1rem;
  color: #333;
  margin-bottom: 24px;
}

.message-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.gradient-button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: 'Roboto', sans-serif;
}

.gradient-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-button {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}
</style>
