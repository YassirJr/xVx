<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center font-bold text-black/80">
      <h2 class="text-9xl">404</h2>
      <h5 class="uppercase text-3xl mb-5">
        {{ $t('page-not-found') }}
      </h5>
      <el-button type="primary" plain @click="$router.push({ name: 'home' })">
        {{ $t('home-page') }}
      </el-button>
    </div>
  </div>
</template>
