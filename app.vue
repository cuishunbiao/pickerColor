<template>
  <div class="min-h-full">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1>pick color from image online</h1>
          </div>
        </div>
      </div>
    </div>
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style="height: calc(100% - 64px);">
      <div class="flex items-center min-h-screen">
        <div class="w-4/5 p-4">
          <canvas ref="canvasBoxRef"></canvas>
        </div>
      </div>
      <div class="fixed right-0 top-1/2 transform -translate-y-1/2 w-1/5 p-4">
        <div class="mb-4">
          <input type="file" class="img-selector hidden" ref="imgSelector" accept="image/*" />
          <label style="display: none;" class="img-selector-btn cursor-pointer block w-32 h-12 bg-blue-500 text-white text-center leading-12 rounded-md hover:bg-blue-600" for="imgSelector" title="JPG,GIF,PNG"></label>
          <button ref="imgSelectorBtn" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Upload image</button>
        </div>
        
        <div class="text-gray-700 mt-10"><b>Current Color:</b></div>
        <div ref="currentHtmlColor"></div>
        <div ref="currentRgbaColor"></div>

        <template v-if="selectColors.length">
          <div class="text-gray-700 mt-10"><b>Selected Colors:</b></div>
          <ul class="list-disc ml-4">
            <li class="text-gray-700" v-for="item in selectColors">{{ item }}</li>
          </ul>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const selectColors = ref([])
const canvasBoxRef = ref(null);
const imgSelectorBtn = ref(null);
const imgSelector = ref(null);
const currentHtmlColor = ref(null);
const currentRgbaColor = ref(null);
const tooltipWidth = 175;
const tooltipHeight = 90;
let hex
let rgbaColor
let rect = null

onMounted(() => {
  const canvas = canvasBoxRef.value;
  const ctx = canvas.getContext('2d');
  let imageWidth = -1;
  let imageHeight;
  let canvasWidth = -1;
  let canvasHeight = -1;
  let imageData = null;
  let currRGB = null;
  let currHTML = null;
  let t = -1;

  const image = new Image();

  function drawImage() {
    if (canvasWidth !== -1) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
    imageWidth = image.width;
    imageHeight = image.height;
    canvasWidth = imageWidth + tooltipWidth;
    if (imageWidth > canvasWidth) {
      canvasWidth = imageWidth;
    }
    canvasHeight = imageWidth + tooltipHeight;
    if (imageHeight > canvasHeight) {
      canvasHeight = imageHeight;
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    rect = canvas.getBoundingClientRect();
    ctx.drawImage(image, 0, 0);
    imageData = ctx.getImageData(0, 0, image.width, image.height).data;
  }

  function loadImage(url) {
    image.src = url;
    image.onload = function () {
      drawImage(image);
    };
  }

  function uploadImage(img) {
    if (!img) return;
    if (img.type.indexOf('image') !== 0) {
      alert('Only images can be uploaded');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = function () {
      loadImage(reader.result);
    };
  }

  imgSelectorBtn.value.addEventListener('click', () => {
    imgSelector.value.click();
  });

  imgSelector.value.addEventListener('change', function (e) {
    uploadImage(e.target.files[0]); // 选中的图片文件
  });

  canvas.addEventListener('mousemove', function (evt) {
    if (imageData !== null) {
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;
      const i = ((y - 1) * imageWidth + x - 1) * 4;
      if (x >= imageWidth || y >= imageHeight) {
        return;
      }
      let tsPointX = x;
      let tsPointY = y;
      if (x + tooltipWidth > canvasWidth) {
        tsPointX = x - tooltipWidth;
      }
      if (y + tooltipHeight > canvasHeight) {
        tsPointY = y - tooltipHeight;
      }
      const red = imageData[i];
      const green = imageData[i + 1];
      const blue = imageData[i + 2];
      const alpha = imageData[i + 3];
      hex = rgbaToHex(red, green, blue);
      rgbaColor = rgbaToString(red, green, blue);
      currentHtmlColor.value.innerHTML = hex;
      currentRgbaColor.value.innerHTML = rgbaColor;
    }
  });

  canvas.addEventListener('mouseout', function () {
    clearTimeout(t);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(image, 0, 0);
    currHTML = currRGB = null;
  });

  canvas.addEventListener('click', function () {
    selectColors.value.push(hex, rgbaColor)
  });

  function rgbaToHex(red, green, blue) {
    if (isNaN(red) || isNaN(green) || isNaN(blue)) {
      return '00'; // 或者您可以返回其他默认颜色
    }
    const hexRed = Math.max(0, Math.min(255, Math.floor(red))).toString(16);
    const hexGreen = Math.max(0, Math.min(255, Math.floor(green))).toString(16);
    const hexBlue = Math.max(0, Math.min(255, Math.floor(blue))).toString(16);

    return `HEX: #${pad(hexRed)}${pad(hexGreen)}${pad(hexBlue)}`;
  }

  function rgbaToString(red, green, blue) {
    if (isNaN(red) || isNaN(green) || isNaN(blue)) {
      return '';
    }
    return `RGB: (${Math.floor(red)}, ${Math.floor(green)}, ${Math.floor(blue)})`;
  }

  function pad(hex) {
    return hex.length === 1 ? '0' + hex : hex;
  }
});
</script>

<style>
h1 {
  text-indent: -9999px;
  background: url('/assets/images/logo.png') no-repeat center center;
  background-size: 100% auto;
  width: 168px;
  height: 50px;
}

canvas {
  box-shadow: 2px 2px 12px -2px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 100%;
}

.img-selector {
  display: none;
}
</style>