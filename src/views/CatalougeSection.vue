<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-[#111111] transition-colors duration-1000 ease-in-out p-4"
  >
    <h1 class="text-4xl font-medium mb-4 text-white brandname">GARLIC</h1>
    <p class="text-xs mb-6 text-white">
      A Zesty Showcase of Advertising's Finest Flavors
    </p>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search by brand name..."
      class="mb-6 p-3 border border-gray-300 border-opacity-20 rounded-full shadow-sm w-full max-w-lg bg-[#201e1f] text-white focus:outline-none focus:ring-2 focus:ring-[#dbed6e] focus:ring-opacity-70"
    />
    <div class="flex space-x-4 mb-6">
      <button
        @click="filterByCategory('All')"
        class="px-4 py-2 rounded-full text-sm font-medium text-white border border-white border-opacity-20 hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 ease-in-out"
      >
        All
      </button>
      <button
        v-for="category in categories"
        :key="category.category"
        @click="filterByCategory(category.category)"
        class="px-4 py-2 rounded-full text-sm font-medium text-white border border-white border-opacity-20 hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 ease-in-out"
      >
        {{ category.category }}
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div
        v-for="(image, index) in displayedImages"
        :key="image.src"
        @click="openAdDisplay(image, index)"
        class="bg-[#201e1f] rounded-lg shadow-md overflow-hidden flex flex-col items-center p-2 cursor-pointer transition-transform duration-300 ease-in-out hover:border hover:border-white hover:border-opacity-25 hover:scale-105"
      >
        <div class="relative w-full">
          <img
            :src="image.src"
            :alt="image.brand"
            class="max-w-full max-h-full object-contain mx-auto"
          />
        </div>
        <div class="mt-2 text-center w-full">
          <p class="text-lg font-medium text-white">{{ image.brand }}</p>
        </div>
      </div>
    </div>

    <!-- Ad Display Popup -->
    <div
      v-if="showAdDisplay"
      class="fixed inset-0 flex items-center justify-center z-50 bg-gray-100 bg-opacity-20 backdrop-blur-sm"
    >
      <div
        class="bg-[#201e1f] rounded-lg p-6 max-w-xl w-full absolute ad-display-popup"
      >
        <button
          @click="closeAdDisplay"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div class="flex flex-col items-center justify-center">
          <h1
            class="text-2xl font-medium mb-3 text-[#fefcf3] transition-colors duration-300 ease-in-out"
            @mouseover="startTitleAnimation"
            @mouseout="resetTitleAnimation"
            ref="title"
          >
            {{ selectedImage.brand }}
          </h1>
          <div
            :class="[
              'overflow-hidden',
              containerClasses,
              'flex',
              'justify-center',
              'items-center',
            ]"
          >
            <img
              ref="image"
              :src="selectedImage.src"
              :alt="selectedImage.brand"
              class="object-contain"
              style="max-width: 100%; max-height: 100%; border-radius: 12px"
              :style="{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))' }"
              @load="onImageLoad"
            />
          </div>
          <div class="mt-3 text-center space-y-2">
            <p
              class="text-lg font-medium text-[#111111] bg-[#dbed6e] inline-block px-3 py-1 rounded-full shadow-sm"
            >
              Principle: {{ selectedImage.principle }}
            </p>
            <h2 class="text-lg text-[#fefcf3]">
              {{ selectedImage.heading }}
            </h2>
            <p class="text-lg text-gray-400 italic">
              {{ selectedImage.description }}
            </p>
          </div>
          <div class="mt-6 flex space-x-4">
            <button
              @click="previousImage"
              class="px-4 py-2 rounded-full text-sm font-medium text-white border border-white hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 ease-in-out"
            >
              Previous
            </button>
            <button
              @click="nextImage"
              class="px-4 py-2 rounded-full text-sm font-medium text-white border border-white hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 ease-in-out"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";

interface ImageItem {
  src: string;
  brand: string;
  principle: string;
  heading: string;
  description: string;
  category: string;
}

interface Category {
  category: string;
  images: ImageItem[];
}

export default defineComponent({
  name: "CatalogueSection",
  setup() {
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const showAdDisplay = ref(false);
    const selectedImage = ref<ImageItem | null>(null);
    const title = ref<HTMLElement | null>(null);
    const image = ref<HTMLImageElement | null>(null);
    const isVisible = ref(false);
    const containerClasses = ref("");
    const selectedImageIndex = ref<number | null>(null);

    const categories = ref<Category[]>([
      {
        category: "Automobile 🚗",
        images: [
          {
            src: require("../assets/volkswagen_ad.png"),
            brand: "Volkswagen",
            principle: "Extreme Examples",
            heading: "How to create humour?",
            description:
              "Use the most extreme examples at either end of the scale",
            category: "Automobile",
          },
          {
            src: require("../assets/bmw.png"),
            brand: "Audi and BMW",
            principle: "Audi and BMW have a history of advertising war:",
            heading:
              '1.  Audi took out a billboard for the A4 saying: "Your move, BMW"',
            description:
              '2.  BMW responded with a bigger billboard saying: "Checkmate"',
            category: "Automobile",
          },
          // Add more image objects for the Automobile category
        ],
      },
      {
        category: "Food and Drinks 🤤",
        images: [
          {
            src: require("../assets/wildturkey_ad.png"),
            brand: "Wild Turkey",
            principle: "Objection Handling",
            heading: "Reframe the conversation around pricing.",
            description: "Via the incredible @goodmarketing_hq",
            category: "Food and Drinks",
          },
          {
            src: require("../assets/tabasco_ad.jpeg"),
            brand: "Tabasco",
            principle: "Picture Is Worth A 1,000 Words",
            heading: "No tag line is needed.",
            description: "",
            category: "Food and Drinks",
          },
          {
            src: require("../assets/chipotle_ad.png"),
            brand: "Chipotle",
            principle: "Optimize for the skim read.",
            heading: "And then hit them with the long read.",
            description: "",
            category: "Food and Drinks",
          },
          {
            src: require("../assets/windsor_ad.png"),
            brand: " Windsor Canadian",
            principle: "Rebecca Black's Friday",
            heading:
              "Create atomic habits by associating yourself with a recurring event.",
            description:
              "• Mariah Carey = Christmas • Rebecca Black = Friday • Windsor Canadian = Evenings",
            category: "Food and Drinks",
          },
          {
            src: require("../assets/J&B_ad.png"),
            brand: "J&B Whisky",
            principle: "Seasonal Hijacking",
            heading: "The holidays aren't the same without J&B",
            description: "",
            category: "Food and Drinks",
          },
        ],
      },
      {
        category: "Health and well being 🍑",
        images: [
          {
            src: require("../assets/childrens_defence_fund.png"),
            brand: "Barriggan",
            principle: "The Handbreak Turn",
            heading: "The Children's Defense Fund",
            description:
              "Speed down one road... and then hit a sudden hand break turn.",
            category: "Health and well being",
          },
          {
            src: require("../assets/themoreyou.jpeg"),
            brand: "Ogilvy Bejing - Phone Addiction",
            principle: "Put the problem on steroids",
            heading: "The more you connect, the less you connect",
            description: "",
            category: "Health and well being",
          },
          {
            src: require("../assets/pilot_ad.jpeg"),
            brand: "Pilot ED Pills",
            principle: "",
            heading: "",
            description: "",
            category: "Health and well being",
          },
          {
            src: require("../assets/listerine.jpeg"),
            brand: "LISTERINE",
            principle: "",
            heading: "",
            description: "",
            category: "Health and well being",
          },
          {
            src: require("../assets/vigrara_ad.png"),
            brand: "pfizer",
            principle: "The Viagra Ad",
            heading: "",
            description: "",
            category: "Health and well being",
          },
          {
            src: require("../assets/viagara_ad02.jpeg"),
            brand: "pfizer - Viagra Ad",
            principle: "2+2=?",
            heading:
              'Step 1: Set up the joke: "Why does this old man have so much wood?"',
            description: "Step 2: Reveal: 'Ahh it's a Viagra ad'",
            category: "Health and well being",
          },
        ],
      },
      {
        category: "Digital Services 📱",
        images: [
          {
            src: require("../assets/economist_ad.jpeg"),
            brand: "The Economist",
            principle: "Create an Anti-Customer",
            heading: "",
            description: "",
            category: "Digital products/services",
          },
          {
            src: require("../assets/kindle_ad.png"),
            brand: "Amazon Kindle",
            principle: "",
            heading: "",
            description: "",
            category: "Digital products/services",
          },
          {
            src: require("../assets/taskrabbit_ad.jpeg"),
            brand: "Task Rabbit",
            principle: "Lyric Hijacking",
            heading: "Step 1 - Take songs stuck in people's heads",
            description: "Step 2 - Tweak to fit your brand",
            category: "Digital products/services",
          },
          {
            src: require("../assets/mastercard_ad.png"),
            brand: "Mastercard",
            principle: "The Honest Hook",
            heading: "",
            description:
              "There are some things money can't buy. For everything else, there's Mastercard",
            category: "Digital products/services",
          },
          // Add more image objects for the Digital products/services category
        ],
      },
      {
        category: "Fashion 👙",
        images: [
          {
            src: require("../assets/newbalance.png"),
            brand: "New Balance",
            principle: "The Unexpected Connection",
            heading: "",
            description: "",
            category: "Threads and wearables",
          },
          {
            src: require("../assets/atoms_ad.png"),
            brand: "Atom",
            principle: "Reframe Expensive Pricing",
            heading:
              "Yes, we could make them cheaper. But if we did that, they'd be cheap.",
            description: "",
            category: "Threads and wearables",
          },
        ],
      },
      {
        category: "Devices and products 🪑",
        images: [
          {
            src: require("../assets/timex_ad.png"),
            brand: "Timex",
            principle: "Create An Enemy",
            heading:
              'Position the competition as Darth Vader or "The Matrix". Position your product as Luke Skywalker or Neo.',
            description:
              "Once someone explains this strategy to you -- you begin to see it everywhere.",
            category: "Devices and products",
          },
          {
            src: require("../assets/bic01.png"),
            brand: "BIC Razors & Pens",
            principle: " 1+1=11",
            heading: "They took out ads next to one another for both products.",
            description: "If you think outside the box, 1+1 can equal 11.",
            category: "Devices and products",
          },
          {
            src: require("../assets/airtag.jpeg"),
            brand: "Apple",
            principle: "",
            heading: "",
            description: "",
            category: "Devices and products",
          },
          {
            src: require("../assets/canon_ad.png"),
            brand: "Canon",
            principle: "The Inner Circle",
            heading: "Use the language of people in the inner circle.",
            description: "",
            category: "Devices and products",
          },
          {
            src: require("../assets/ikea01_ad.jpeg"),
            brand: "Ikea",
            principle: "The Shell Ad",
            heading: "Looks like a sleeping pill advert...",
            description: "It's an advert for Ikea's £13 alternative.",
            category: "Devices and products",
          },
          {
            src: require("../assets/Ikea02.jpeg"),
            brand: "Ikea - The Pee Ad",
            principle: "The 3D Ad",
            heading: "This ad ran in a Swedish women's magazine.",
            description:
              "It had a pregnancy test built into the strip -- and if revealed they were pregnant -- it also showed a discount code on a baby's crib at the same time.",
            category: "Devices and products",
          },
        ],
      },
      {
        category: "Uncategorised 📌",
        images: [
          {
            src: require("../assets/banking_ad.png"),
            brand: "Frost Bank",
            principle: "Big vs Small",
            heading: "Get their attention with the big font",
            description: "Educate them with the small font",
            category: "Uncategorised",
          },
          {
            src: require("../assets/meowbox_ad.png"),
            brand: "Meowbox - Cat Treats & Toys",
            principle: "The Nightmare Scenario",
            heading:
              "Show them the worst-case scenario if they don't use your product.",
            description:
              "Keep them busy with hand-picked toys and treats, delivered monthly",
            category: "Uncategorised",
          },
          {
            src: require("../assets/Uber.png"),
            brand: "UberPlanet",
            principle: "The 10x Metaphor",
            heading:
              "Uber using wildlife to promote their new sustainable service.",
            description: "",
            category: "Uncategorised",
          },
        ],
      },
    ]);

    const allImages = computed(() => {
      return categories.value.flatMap((category) => category.images);
    });

   const displayedImages = computed(() => {
  if (selectedCategory.value === 'All') {
    if (searchQuery.value) {
      return allImages.value.filter((image) =>
        image.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    } else {
      return shuffleArray(allImages.value);
    }
  } else if (selectedCategory.value) {
    const category = categories.value.find(
      (cat) => cat.category === selectedCategory.value
    );
    if (category) {
      if (searchQuery.value) {
        return category.images.filter((image) =>
          image.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      } else {
        return category.images;
      }
    } else {
      return [];
    }
  } else {
    return allImages.value;
  }
});

    const shuffleArray = (array: any[]) => {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
          shuffledArray[j],
          shuffledArray[i],
        ];
      }
      return shuffledArray;
    };

    const filterByCategory = (category: string) => {
  selectedCategory.value = category;
  searchQuery.value = ''; // Reset the search query when a category is selected
};

    const openAdDisplay = (image: ImageItem, index: number) => {
      selectedImage.value = image;
      selectedImageIndex.value = index;
      showAdDisplay.value = true;
    };

    const closeAdDisplay = () => {
      showAdDisplay.value = false;
    };

    const nextImage = () => {
      if (selectedImageIndex.value !== null) {
        const nextIndex =
          (selectedImageIndex.value + 1) % displayedImages.value.length;
        selectedImage.value = displayedImages.value[nextIndex];
        selectedImageIndex.value = nextIndex;
      }
    };

    const previousImage = () => {
      if (selectedImageIndex.value !== null) {
        const previousIndex =
          (selectedImageIndex.value - 1 + displayedImages.value.length) %
          displayedImages.value.length;
        selectedImage.value = displayedImages.value[previousIndex];
        selectedImageIndex.value = previousIndex;
      }
    };

    const startTitleAnimation = () => {
      if (title.value) {
        title.value.style.animation =
          "shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
      }
    };

    const resetTitleAnimation = () => {
      if (title.value) {
        title.value.style.animation = "none";
      }
    };

    const onImageLoad = () => {
      if (image.value) {
        const { naturalWidth, naturalHeight } = image.value;
        const aspectRatio = naturalWidth / naturalHeight;

        if (aspectRatio > 1) {
          containerClasses.value = "landscape-container";
        } else if (aspectRatio < 1) {
          containerClasses.value = "portrait-container";
        } else {
          containerClasses.value = "square-container";
        }
      }
    };

    onMounted(() => {
      setTimeout(() => {
        isVisible.value = true;
      }, 500);
    });

    return {
      searchQuery,
      categories,
      displayedImages,
      filterByCategory,
      openAdDisplay,
      closeAdDisplay,
      showAdDisplay,
      selectedImage,
      nextImage,
      previousImage,
      title,
      isVisible,
      containerClasses,
      startTitleAnimation,
      resetTitleAnimation,
      onImageLoad,
      image,
      selectedImageIndex,
    };
  },
});
</script>


<style scoped>
* {
  font-family: epilogue;
}

.brandname {
  font-family: asset;
}

.caption {
  font-family: notable;
}

.image-rounded {
  border-radius: 10px !important;
}

.relative {
  position: relative;
  padding-top: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 10px;
}

.relative img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 0.25rem;
  border-radius: 12px;
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

.bg-black {
  background-color: #000;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.landscape-container {
  width: 500px;
  height: 300px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.portrait-container {
  width: 300px;
  height: 500px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.square-container {
  width: 400px;
  height: 400px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeSlideUp {
  animation: fadeSlideUp 0.8s ease-out forwards;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-400 {
  animation-delay: 0.4s;
}

.ad-display-popup {
  max-height: 96vh; /* Set the maximum height to 80% of the viewport height */
  overflow-y: auto; /* Add scroll behavior if content exceeds the maximum height */
}
</style>