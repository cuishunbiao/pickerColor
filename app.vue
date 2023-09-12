<template>
  <div class="min-h-full flex root">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center" style="flex-direction: column">
      <div class="container-box">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1>pick color from image online</h1>
            </div>
          </div>
        </div>
        <button @click="pullUpFile" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Upload you image
        </button>
        <template v-if="currentHEXColor">
          <div class="text-gray-700 mt-20">
            <b style="color: rgb(59 130 246 / 1); font-size: 20px">Current Color</b>
          </div>
          <div ref="currentHEXColorDom"></div>
          <div ref="currentRGBColorDom"></div>
        </template>
        <div class="text-gray-700 mt-20" v-if="colorArray.length">
          <b style="color: rgb(59 130 246 / 1); font-size: 20px">Selected Color</b>
        </div>
        <div v-for="(color, index) in colorArray" :key="index" :style="{
          background: color.hex.slice(4, color.hex.length),
          width: '165px',
          marginBottom: '20px',
          padding: '5px',
        }" class="colorBox">
          {{ color.hex }}<br />{{ color.rgb }}
        </div>
      </div>
    </div>
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <canvas class="canvas" ref="canvas" @mousemove="handleCanvasMouseMove" @click="handleCanvasClick"></canvas>
    </main>
    <input type="file" class="img-selector" ref="imgSelector" @change="handleImageUpload" accept="image/*" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import defaultImg from '~/assets/images/pic.jpeg'
const colorArray = ref([]);
const currentHEXColor = ref("");
const currentRGBColor = ref("");
const currentHEXColorDom = ref("");
const currentRGBColorDom = ref("");
const imgSelector = ref("");

const renderDefaultImage = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  const defaultImage = new Image();

  defaultImage.onload = () => {
    canvas.width = defaultImage.width;
    canvas.height = defaultImage.height;
    ctx.drawImage(defaultImage, 0, 0);
  };
  document.querySelector("canvas").style.display = "block";
  defaultImage.src = defaultImg;
};


const handleImageUpload = (event) => {

  const file = event.target.files[0];
  if (file) {
    const image = new Image();
    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d");
    image.onload = () => {
      if (image.width > 700) {
        const scale = 700 / image.width;
        const canvasWidth = 700;
        const canvasHeight = image.height * scale;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      }
    };
    image.src = URL.createObjectURL(file);
  }
};

const handleCanvasMouseMove = (event) => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  const x = event.offsetX;
  const y = event.offsetY;

  const imageData = ctx.getImageData(x, y, 1, 1).data;
  const rgbaColor = `${imageData[0]}, ${imageData[1]}, ${imageData[2]}`;
  const hexColor = `#${imageData[0].toString(16).padStart(2, "0")}${imageData[1]
    .toString(16)
    .padStart(2, "0")}${imageData[2].toString(16).padStart(2, "0")}`;

  currentHEXColor.value = `HEX: ${hexColor}`;
  currentRGBColor.value = `RGB: (${rgbaColor})`;
  currentHEXColorDom.value.innerHTML = currentHEXColor.value;
  currentRGBColorDom.value.innerHTML = currentRGBColor.value;
};

const handleCanvasClick = () => {
  if (currentHEXColor.value) {
    colorArray.value.push({
      hex: currentHEXColor.value,
      rgb: currentRGBColor.value,
    });
  }
};

const canvasRef = ref(null);

const pullUpFile = () => {
  imgSelector.value.click();
};

onMounted(() => {
  canvasRef.value = document.querySelector("canvas");
  document.querySelector("canvas").style.cursor = "crosshair";
  renderDefaultImage();
});
</script>

<style>
h1 {
  text-indent: -9999px;
  background: url("/assets/images/logo.png") no-repeat center center;
  background-size: 100% auto;
  width: 168px;
  height: 50px;
}

main {
  display: flex;
  align-items: center;
}

.container {
  height: calc(100% - 64px);
}

.container-box {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 100px;
  padding-left: 60px;
  padding-top: 30px;
  position: fixed;
}

.container-box.style {
  left: 0;
}

.container-box button {
  margin-top: 83px;
}

.img-selector {
  display: none;
}

.canvas {
  display: none;
  border: #ccc 1px solid;
}
</style>
