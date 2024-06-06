<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 transition-colors duration-1000 ease-in-out p-4">
    <h1 class="text-2xl font-medium mb-4 text-gray-800">Hero Section</h1>
    <p class="mb-6">This is the Hero Section component.</p>

    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search by brand name..." 
      class="mb-6 p-2 border border-gray-300 rounded-md shadow-sm w-full max-w-md"
      @input="filterImages"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="image in filteredImages" 
        :key="image.src" 
        class="relative bg-white rounded-lg shadow-md overflow-hidden p-4"
      >
        <img 
          :src="image.src" 
          :alt="image.brand" 
          class="max-w-full max-h-full w-auto h-auto object-contain"
        />
        <div class="mt-2 text-center">
          <p class="text-lg font-medium text-gray-700">{{ image.brand }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'HeroSection',
  setup() {
    const searchQuery = ref('');
    const categories = ref([
      {
        category: 'Cars',
        images: [
          { src: require('../assets/volkswagen_ad.png'), brand: 'Volkswagen', principle: 'Extreme Examples', heading: 'How to create humour?', description: 'Use the most extreme examples at either end of the scale' },
          // Add more image objects here with their metadata
        ]
      },
      {
        category: 'Electronics',
        images: [
          { src: require('../assets/pilot_ad.jpeg'), brand: 'Sony', principle: 'Innovation', heading: 'Leading Technology', description: 'Sony provides leading technology in every product' },
          // Add more image objects here with their metadata
        ]
      },
      // Add more categories as needed
    ]);

    const filteredImages = computed(() => {
      if (!searchQuery.value) {
        return categories.value.flatMap(category => category.images);
      }
      return categories.value.flatMap(category => category.images).filter(image => image.brand.toLowerCase().includes(searchQuery.value.toLowerCase()));
    });

    const filterImages = () => {
      // This function can be used to trigger the computed property if necessary
    };

    onMounted(() => {
      // Load images and initialize necessary states if needed
    });

    return { searchQuery, filteredImages, filterImages };
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
