<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 transition-colors duration-1000 ease-in-out">
      <h1 
        class="text-2xl font-medium mb-4 text-gray-800 hover:text-red-600 transition-colors duration-300 ease-in-out"
        @mouseover="startTitleAnimation"
        @mouseout="resetTitleAnimation"
        ref="title"
      >
        Volkswagen
      </h1>
      <div 
        :class="['bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center p-4 transform hover:scale-105 transition-transform duration-500 ease-in-out', containerClasses]"
      >
        <img
          ref="image"
          src="../assets/pilot_ad.jpeg"
          alt="Volkswagen Car"
          class="max-w-full max-h-full w-auto h-auto object-contain"
          @load="onImageLoad"
        />
      </div>
      <div class="mt-6 text-center space-y-2">
        <p 
          class="text-lg font-medium text-gray-700 bg-gray-200 inline-block px-3 py-1 rounded-full shadow-sm opacity-0 transform translate-y-4"
          :class="{'animate-fadeSlideUp': isVisible}"
        >
          Principle: Extreme Examples
        </p>
        <h2 
          class="text-lg text-gray-800 opacity-0 transform translate-y-4"
          :class="{'animate-fadeSlideUp delay-200': isVisible}"
        >
          How to create humour?
        </h2>
        <p 
          class="text-lg text-gray-600 italic opacity-0 transform translate-y-4"
          :class="{'animate-fadeSlideUp delay-400': isVisible}"
        >
          Use the most extreme examples at either end of the scale
        </p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  
  export default defineComponent({
    name: 'AdDisplay',
    setup() {
      const title = ref<HTMLElement | null>(null);
      const image = ref<HTMLImageElement | null>(null);
      const isVisible = ref(false);
      const containerClasses = ref('landscape-container');
  
      const startTitleAnimation = () => {
        if (title.value) {
          title.value.style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both';
        }
      };
  
      const resetTitleAnimation = () => {
        if (title.value) {
          title.value.style.animation = 'none';
        }
      };
  
      const onImageLoad = () => {
        if (image.value) {
          const { naturalWidth, naturalHeight } = image.value;
          if (naturalWidth > naturalHeight) {
            containerClasses.value = 'landscape-container';
          } else if (naturalWidth < naturalHeight) {
            containerClasses.value = 'portrait-container';
          } else {
            containerClasses.value = 'square-container';
          }
        }
      };
  
      onMounted(() => {
        setTimeout(() => {
          isVisible.value = true;
        }, 500);
      });
  
      return { title, isVisible, containerClasses, startTitleAnimation, resetTitleAnimation, onImageLoad, image };
    }
  });
  </script>
  
  <style scoped>
  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
    40%, 60% { transform: translate3d(3px, 0, 0); }
  }
  
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeSlideUp {
    animation: fadeSlideUp 0.8s ease-out forwards;
  }
  
  .delay-200 { animation-delay: 0.2s; }
  .delay-400 { animation-delay: 0.4s; }
  
  .landscape-container {
    width: 500px;
    height: 300px;
  }
  
  .portrait-container {
    width: 300px;
    height: 500px;
  }
  
  .square-container {
    width: 400px;
    height: 400px;
  }
  </style>
  