<template>
  <div>
    <h2 v-if="header" class="text-lg text-yellow-800">
      {{ header }}
    </h2>

    <div class="flex flex-col divide-y divide-gray-100 border border-gray-100">
      <component
          :is="componentName"
          v-for="item of items"
          :class="{'hover:bg-gray-100': hasLink}"
          :href="dynamicLink(item)"
          class="bg-white py-2 px-4 flex flex-row"
          target="_blank"
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
import ListMixin from "@/mixins/ListMixin.js";

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
    }
  },
  mixins: [ListMixin],
  computed: {
    componentName() {
      return this.hasLink ? 'a' : 'div';
    },
    hasLink() {
      return this.link !== null;
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
