<template>
  <div class="flex flex-col">
    <label for="name" class="text-gray-600 text-sm">{{ label }}</label>
    <input
        id="name"
        :class="{'opacity-50': disabled}"
        :disabled="disabled"
        v-model="internalValue"
        autofocus
        class="focus:ring-2 ring-primary-500 outline-none border-primary-800 border-opacity-10 border-2 rounded py-2 px-3"
        ref="input"
        :placeholder="placeholder"
    >
    <div class="text-gray-400 text-xs" v-if="subheader">{{ subheader }}</div>

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
    placeholder: {
      type: String,
      required: true
    },
    subheader: {
      type: String,
      required: false,
      default: null
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
