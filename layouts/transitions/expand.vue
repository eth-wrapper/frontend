<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot/>
  </transition>
</template>

<style scoped >
  .expand-enter-active,
  .expand-leave-active {
    transition: height 500ms ease-in-out;
    overflow: hidden;
  }
  .expand-enter,
  .expand-leave-to {
    height: 0;
  }

</style>

<style scoped>
  * {
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
</style>

<script>
export default {
  name: 'TransitionExpand',
  methods: {
    enter(element) {
      const height = getComputedStyle(element).height;
      console.log(`height at enter: ${height}`);
      element.style.height = 0;
      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;

      // Trigger the animation.
      // We use `setTimeout` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.
      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
    leave(element) {
      const height = getComputedStyle(element).height;

      element.style.height = height;

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height;

      setTimeout(() => {
        element.style.height = 0;
      });
    },
  },
};
</script>
