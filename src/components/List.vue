<template>
  <div>
    <div v-if="header || headerLink" class="flex flex-row items-center justify-between mb-1">
      <div v-if="header || subheader">
        <h2 class="text-lg text-yellow-800" v-if="header">
          {{ header }}
        </h2>
        <div class="text-sm text-gray-600" v-if="subheader">
          {{ subheader }}
        </div>
      </div>

      <RouterLink v-if="headerLink" :to="{name: headerLink}" class="w-6 h-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-yellow-600 hover:stroke-yellow-700 transition duration:100">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </RouterLink>
    </div>

    <div class="rounded flex flex-col divide-y divide-gray-100 border border-gray-100">
      <component
          :is="componentName"
          v-for="item of items"
          :class="{'hover:bg-gray-100 cursor-pointer': hasLink || isInteractive}"
          :href="dynamicLink(item)"
          class="rounded bg-white py-2 px-4 flex flex-row"
          target="_blank"
          @click="$emit('select', item)"
      >
        <slot name="row" :item="item">
          <div class="rounded w-10 h-10 overflow-hidden mr-4">
            <slot name="img" :item="item"></slot>
          </div>

          <div class="flex flex-col">
            <div class="text-yellow-800">
              <slot name="title" :item="item"></slot>
            </div>
            <div class="text-gray-500 text-xs">
              <slot name="subtitle" :item="item"></slot>
            </div>
            <div class="text-gray-500 text-xs">
              <slot name="undertitle" :item="item"></slot>
            </div>
          </div>
        </slot>
      </component>
    </div>
  </div>
</template>

<script>
import ListMixin from "../mixins/ListMixin.js";

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    link: {
      type: Function,
      required: false,
      default: null
    },
  },
  mixins: [ListMixin],
  computed: {
    componentName() {
      return this.hasLink ? 'a' : 'div';
    },
    hasLink() {
      return (typeof this.link === 'function' && this.link(this.items[0]) !== null) || typeof this.link === 'string';
    }
  },
  methods: {
    dynamicLink(item) {
      if (!this.hasLink) {
        return null;
      }

      return this.link(item)
    },
  }
}
</script>
