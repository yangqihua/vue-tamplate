<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="active-color">
      <countTo
        :startVal="Number(0)"
        :endVal="Number(10312.31)"
        :duration="2000"
        :decimals="4"
        separator=","
      ></countTo>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import countTo from 'vue-count-to'

export default {
  name: 'Dashboard',
  components: { countTo },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.active-color {
  color: #daa25f;
  font-size: 36px;
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
