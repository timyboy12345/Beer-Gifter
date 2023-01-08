<template>
  <div class="p-4 rounded border-2 border-yellow-600 bg-yellow-600 bg-opacity-20">
    <slot name="header">
      <h2 v-if="header" class="font-bold text-yellow-800 mb-2">
        {{ header }}
      </h2>
    </slot>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    header: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
