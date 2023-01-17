<template>
  <div class="w-full h-full flex flex-row items-center justify-center">
    <div class="text-gray-600 flex flex-row items-center">
      <div class="inline-block mr-2">
        <Spinner/>
      </div>

      {{ $t('loading_modal.information_being_retrieved') }}
    </div>
  </div>
</template>
<script>
import Spinner from "../Spinner.vue";

export default {
  components: {Spinner}
}
</script>
