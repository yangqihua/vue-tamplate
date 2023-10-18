<template>
  <div class="dashboard-container">
    <div class="kline-box">
      <div class="info-title">信息</div>
      <div id="indicator-k-line" class="k-line-chart"/>

      <div class="indicators-box">
        <div class="title">指标:</div>
        <el-checkbox-group size="mini" v-model="checkList">
          <el-checkbox :label="name" v-for="(item,name) in indicators"></el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="k-line-chart-menu-container">
        <span style="padding-right: 10px">主图指标</span>
        <button
          v-for="type in mainIndicators"
          :key="type"
          v-on:click="setMainIndicator(type)"
        >
          {{ type }}
        </button>
        <button v-on:click="setMainIndicator('EMOJI')">自定义</button>
        <span style="padding-right: 10px; padding-left: 12px">副图指标</span>
        <button
          v-for="type in subIndicators"
          :key="type"
          v-on:click="setSubIndicator(type)"
        >
          {{ type }}
        </button>
        <button v-on:click="setSubIndicator('EMOJI')">自定义</button>
      </div>
    </div>

    <div class="table-box">
      <div class="info-title"> 币种列表</div>
      <el-table
        :data="symbols"
        size="small"
        stripe border
        style="width: 100%"
      >
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column sortable label="上线时间" min-width="120">
          <template v-slot="item">
            {{ (item.row.time / 1000) | dateFormatYMDF }}
          </template>
        </el-table-column>
        <el-table-column sortable label="名称" min-width="80">
          <template v-slot="item" @click="setActiveSymbol(item.row.symbol)">
            <el-tag type="primary">{{ (item.row.symbol.replace('USDT', '')) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable prop="price_size" label="价格增量" min-width="80"></el-table-column>
        <el-table-column sortable prop="min_size" label="最小下单量" min-width="80"></el-table-column>
        <el-table-column label="查看">
          <template v-slot="item">
            <el-button @click="setActiveSymbol(item.row.symbol)" round type="primary" size="mini">
              <i class="el-icon-upload el-icon--right"></i> 查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import countTo from 'vue-count-to'

import { dispose, init, registerIndicator } from 'klinecharts'

import * as utils from '@/utils/index.js'
import { customStyles } from '@/utils/klineStyles.js'

const fruits = [
  '🍏',
  '🍎',
  '🍐',
  '🍊',
  '🍋',
  '🍌',
  '🍉',
  '🍇',
  '🍓',
  '🍈',
  '🍒',
  '🍑',
  '🍍',
  '🥥',
  '🥝',
  '🥭',
  '🥑',
  '🍏'
]

registerIndicator({
  name: 'EMOJI',
  figures: [{ key: 'emoji' }],
  calc: (kLineDataList) => {
    return kLineDataList.map((kLineData) => ({
      emoji: kLineData.close,
      text: fruits[Math.floor(Math.random() * 17)]
    }))
  },
  draw: ({ ctx, barSpace, visibleRange, indicator, xAxis, yAxis }) => {
    const { from, to } = visibleRange
    ctx.font = `${barSpace.gapBar}px Helvetica Neue`
    ctx.textAlign = 'center'
    const result = indicator.result
    for (let i = from; i < to; i++) {
      const data = result[i]
      const x = xAxis.convertToPixel(i)
      const y = yAxis.convertToPixel(data.emoji)
      ctx.fillText(data.text, x, y)
    }
    return false
  }
})
export default {
  name: 'Dashboard',
  components: { countTo },

  data() {
    return {
      mainIndicators: ['MA', 'EMA', 'SAR'],
      subIndicators: ['VOL', 'MACD', 'KDJ'],

      symbols: [],
      activeSymbol: {},
      barInfo: {},
      checkList: ['EMA', 'OBV'],
      indicators: {
        // '分型': {
        //   id: null,
        //   isMain: true,
        //   config: {
        //     name: 'FX'
        //   }
        // },
        // '笔': {
        //   id: null,
        //   isMain: true,
        //   config: {
        //     name: 'BI'
        //   }
        // },
        'EMA': {
          id: null,
          isMain: true,
          config: {
            name: 'EMA',
            precision: 3,
            calcParams: [16, 96],
            styles: {
              lines: [
                { style: 'solid', size: 1, color: '#00ff00' },
                { style: 'solid', size: 1, color: '#ff00ff' }
              ]
            }
          }
        },
        'OBV': {
          id: null,
          isMain: false,
          config: {
            name: 'OBV',
            precision: 3,
            calcParams: []
          }
        }
      }
    }
  },
  async mounted() {
    await this.getSymbols()
    this.activeSymbol = this.symbols[0]
    // await this.getSymbolBar()
    await this.initChart()

    setTimeout(() => {
      this.checkList.forEach(key => {
        this.renderIndicator(key)
      })
    }, 100)

  },

  methods: {
    async initChart() {
      console.log('customStyles:', customStyles)
      this.chart = init('indicator-k-line', { styles: customStyles })
      // this.chart.applyNewData(this.barInfo['kline'])
      this.paneId = this.chart.createIndicator({
        name: 'VOL',
        precision: 2,
        calcParams: [16]
      }, true)
    },
    async getSymbols() {
      this.symbols = await this.$api.getSymbols()
    },
    async setActiveSymbol(item) {
      this.activeSymbol = item
    },
    async getSymbolBar() {
      let param = {
        symbol: this.activeSymbol.symbol,
        interval: '15m',
        start_time: utils.getNow() - 3 * 24 * 3600 * 1000,
        end_time: utils.getNow()
      }
      let res = await this.$api.getSymbolBar(param)
      for (let i = 0; i < res['kline'].length; i++) {
        let item = res['kline'][i]
        res['kline'][i] = {
          close: item['close'],
          high: item['high'],
          low: item['low'],
          open: item['open'],
          timestamp: item['dt'] * 1000,
          volume: item['vol'],
          turnover: item['amount']
        }
      }
      for (let i = 0; i < res['bi'].length; i++) {
        let item = res['bi'][i]
        res['bi'][i] = {
          bi: item['bi'],
          timestamp: item['dt'] * 1000
        }
      }
      for (let i = 0; i < res['fx'].length; i++) {
        let item = res['fx'][i]
        res['fx'][i] = {
          bi: item['fx'],
          timestamp: item['dt'] * 1000
        }
      }
      this.barInfo = res
      console.log('this.barInfoaa:', this.barInfo)
    },
    renderIndicator(item) {
      if (this.indicators[item].isMain) {
        this.indicators[item]['id'] = this.chart.createIndicator(this.indicators[item].config, true, { id: 'candle_pane' })
      } else {
        this.indicators[item]['id'] = this.chart.createIndicator(this.indicators[item].config, true)
      }
    },
    setMainIndicator(name) {
      this.chart.createIndicator(name, false, { id: 'candle_pane' })
    },
    setSubIndicator(name) {
      this.chart.createIndicator(name, false, { id: this.paneId })
    }
  },
  beforeDestroy() {
    dispose('indicator-k-line')
  },

  computed: {
    ...mapGetters([
      'name'
    ])
  },

  watch: {
    async activeSymbol(val, oldVal) {
      console.log('val', val)
      await this.getSymbolBar()
      this.chart.applyNewData(this.barInfo['kline'])
    },
    checkList(val, oldVal) {
      if (val.length > oldVal.length) {
        val.forEach(item => {
          if (oldVal.indexOf(item) < 0) {
            this.renderIndicator(item)
          }
        })
      } else {
        oldVal.forEach(item => {
          if (val.indexOf(item) < 0) {
            this.chart.removeIndicator(this.indicators[item].id, this.indicators[item].config.name)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.active-color {
  color: #daa25f;
  font-size: 36px;
}

.indicators-box {
  display: flex;
  align-items: center;
  margin: 12px 0;

  .title {
    color: #333;
    font-weight: 500;
    font-size: 15px;
    margin-right: 12px;
  }
}

.info-title {
  font-size: 22px;
  color: #333;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 12px;
}

.k-line-chart {
  height: 600px;
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
