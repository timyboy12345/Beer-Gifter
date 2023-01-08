<template>
  <div class="flex flex-col">
    <h3 class="text-sm text-yellow-800 mb-1" v-if="header">
      {{ header }}
    </h3>

    <div class="flex flex-row break-keep whitespace-nowrap overflow-scroll gap-2">
      <div v-for="filter of items"
           class="transition duration:100 rounded text-white py-1 px-2 cursor-pointer"
           :class="{'bg-yellow-600 hover:bg-yellow-700': activeFilterId === filter.id, 'bg-gray-400 hover:bg-gray-500': activeFilterId !== filter.id}"
           @click="selectFilter(filter)">
        <slot name="filter" :item="filter"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    activeFilterId: {
      type: String | Number,
      required: false,
      default: null
    },
    header: {
      type: String,
      required: false,
      default: null
    }
  },
  methods: {
    selectFilter(filter) {
      this.$emit('select', filter.id);
    }
  }
}
</script>
