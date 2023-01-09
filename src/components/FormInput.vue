<template>
  <div class="flex flex-col">
    <label for="name">{{ label }}</label>
    <input
        id="name"
        :class="{'opacity-50': disabled}"
        :disabled="disabled"
        v-model="internalValue"
        autofocus
        class="focus:ring-2 ring-yellow-500 outline-none border-yellow-800 border-opacity-10 border-2 rounded py-2 px-4"
        ref="input"
    >

    <div class="text-red-800 text-italic text-sm mt-2" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('input', this.$refs.input.value);
      }
    }
  },
  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    error: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
