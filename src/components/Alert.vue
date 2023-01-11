<template>
  <div
      class="p-4 rounded border-2 bg-opacity-20"
      :class="{'border-yellow-600 bg-yellow-600': important, 'bg-gray-300 border-gray-300': !important}"
  >
    <slot name="header">
      <h2
          v-if="header" class="font-bold mb-2"
          :class="{'text-yellow-800': important, 'text-gray-600': !important}"
      >
        {{ header }}
      </h2>
    </slot>

    <slot>
      <div class="text-gray-600 text-sm">{{ content }}</div>
    </slot>
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
    },
    content: {
      type: String,
      required: false,
      default: null
    },
    important: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>
