<template>
  <div class="select" ref="selectElement" @focus="toggleSelect(true)">
    <div
      class="select-toggle input"
      :class="{
        'input-populated': modelValue || autocompleteSearch || placeholder,
        'input-active': isSelectActive,
      }"
      @click="toggleSelect(true)"
    >
      <label>
        {{ label }}
      </label>

      <Icon v-if="icon" class="ml-2" :src="icon" />

      <input
        v-if="autocomplete"
        v-model="autocompleteSearch"
        class="select-input"
        ref="autocompleteInput"
        :placeholder="placeholder"
        @input="autocompleteChange"
        @focus="toggleSelect(true)"
      />

      <span v-else class="pl-2">
        {{ selected }}
      </span>

      <div class="ml-auto">
        <LoadingSpinner v-if="loading" class="mr-2" :size="12" />
        <Icon
          class="select-arrow"
          :class="{ 'xf-select-arrow-active': isSelectActive }"
          src="chevron-down"
          :size="10"
          fill="grey"
          @click.stop="toggleSelect(!isSelectActive)"
        />
      </div>
    </div>

    <div
      v-if="isSelectActive && (showOptions.length || noResults)"
      class="select-items"
    >
      <div class="select-items-content">
        <template v-if="showOptions.length">
          <div
            v-for="(option, i) in showOptions"
            :key="i"
            class="select-items-item"
            @click="optionSelected(option)"
          >
            {{ option.text }}
          </div>
        </template>

        <p v-else-if="noResults" class="text-center">No results</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, PropType } from "vue";
import { SelectOption } from "@/types/app.types";
import { debounce } from "@/composables/generic";
import { onClickOutside } from "@vueuse/core";

import LoadingSpinner from "@/components/basic/loading/LoadingSpinner.vue";
import Icon from "@/components/basic/icon/Icon.vue";

// ** Props **
const props = defineProps({
  modelValue: {
    type: [String, Number, Object, null] as PropType<
      string | number | SelectOption | null
    >,
    default: "",
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
    required: true,
  },
  autocomplete: {
    type: Boolean,
    default: false,
  },
  outsideRequest: {
    type: Function,
    default: undefined,
  },
  icon: {
    type: String,
    default: "",
  },
});

// ** Emits **
const emits = defineEmits(["update:modelValue", "searchTerm", "select:toggle"]);

// ** Data **
const selected = ref<SelectOption | string | number>("");
const isSelectActive = ref<boolean>(false);
const autocompleteSearch = ref<string>("");
const showOptions = ref<SelectOption[]>(props.options);
const loading = ref<boolean>(false);
const selectElement = ref<HTMLDivElement>();
const noResults = ref<boolean>(false);
const autocompleteInput = ref<HTMLInputElement>();

// ** Methods **
const setOptions = async (): Promise<void> => {
  loading.value = true;
  noResults.value = false;

  showOptions.value = [];

  if (autocompleteSearch.value && autocompleteSearch.value.length > 1) {
    // Run the function which has been defined outside this component and passed in.
    // OutsideRequest must return the results so they can be used here.
    if (props.outsideRequest) {
      showOptions.value = await props.outsideRequest(autocompleteSearch.value);
    } else {
      showOptions.value = props.options
        .filter((option) =>
          option.text
            .toLowerCase()
            .includes(autocompleteSearch.value.toLowerCase()),
        )
        .slice(0, 8);
    }
  }

  if (!showOptions.value.length && autocompleteSearch.value.length > 1) {
    noResults.value = true;
  }

  emits("searchTerm", autocompleteSearch.value);
  loading.value = false;
};

const autocompleteChange = debounce(setOptions, 400);

const optionSelected = (option: SelectOption): void => {
  if (option.text !== selected.value && isSelectActive.value) {
    emits("update:modelValue", option);
    toggleSelect(false);
  }
};

const toggleSelect = (val: boolean): void => {
  if (val !== isSelectActive.value) {
    const selectedMatchesSearch: boolean =
      (selected.value as SelectOption)?.value === autocompleteSearch.value ||
      selected.value === autocompleteSearch.value;

    isSelectActive.value = val;

    emits("select:toggle", val);

    if (props.autocomplete && autocompleteInput.value && val) {
      autocompleteInput.value.focus();
    }

    if (!val && autocompleteSearch.value && !selectedMatchesSearch) {
      autocompleteSearch.value = "";
      noResults.value = false;
    }
  }
};

onClickOutside(selectElement, () => {
  if (isSelectActive.value) {
    toggleSelect(false);
  }
});

// ** Lifecycle **
onMounted(() => {
  if (props.autocomplete) {
    showOptions.value = [];
  }
});

// ** Watchers **
watch(
  () => props.modelValue,
  async (value) => {
    let val = "";

    // When passing a value to the autocomplete, if there are no options shown then run the search the set them
    if (
      props.autocomplete &&
      props.outsideRequest &&
      !showOptions.value.length
    ) {
      autocompleteSearch.value = (value as number)?.toString();

      await setOptions();
    }

    // If value isn't an object - find its matching option and get the text value
    if (typeof value !== "object") {
      const matchingOption: SelectOption | undefined = showOptions.value.find(
        (option) => option.value == value,
      );

      val = matchingOption ? matchingOption.text : "";
    } else {
      val = (value as SelectOption).text || "";
    }

    selected.value = val;
    autocompleteSearch.value = val;
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/theme/variables/_colours";

.select {
  position: relative;
  font-size: 12px;
  z-index: 10;

  &-toggle {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid map.get(colours.$colours, "border");
    position: relative;
    color: black;
  }

  &:focus {
    border: 0;
    outline: none;
  }

  &-input {
    margin-right: 5px;
    margin-left: -2px;
  }

  &-items {
    position: absolute;
    background: white;
    width: 100%;
    margin-top: 2px;
    box-shadow: 1px 4px 4px rgba(0, 0, 0, 0.4);
    border: 1px solid map.get(colours.$colours, "border");
    color: black;
    border-radius: 5px;
    overflow-y: hidden;

    &-content {
      overflow-y: auto;
      max-height: 200px;
    }

    &-item {
      cursor: pointer;
      padding: 5px 0 7px 10px;
      display: flex;
      align-items: center;
      font-size: 12px;

      &:hover {
        background: map.get(colours.$colours, "grey-lighten-5");
      }

      &:not(:last-child) {
        border-bottom: 1px solid map.get(colours.$colours, "border");
      }
    }
  }

  &-arrow {
    margin-top: 5px;
    margin-right: 5px;
    transition: all 0.4s ease-out;

    &-active {
      transform: rotate(180deg);
    }
  }
}
</style>
