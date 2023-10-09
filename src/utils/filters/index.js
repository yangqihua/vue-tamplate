import Vue from 'vue'
import moment from 'moment';
import numeral from 'numeral';

// 位数分割 128,373,883
Vue.filter('numeralFormat', (value, p) => {
    let xstr = '0';
    if (p) {
        xstr = '0.';
        for (let i = 0; i < p; i++) { // eslint-disable-line
            xstr += '0';  // eslint-disable-line
        }
    }
    return numeral(value).format(`0,${xstr}`);
});

Vue.filter('formatNumber', (number, minPrecision = 2, maxPrecision = 2) => {
    if (!number) {
        number = 0;
    }
    const options = {
        minimumFractionDigits: minPrecision,
        maximumFractionDigits: maxPrecision,
    }
    return Number(number).toLocaleString(undefined, options)
});


// unix 时间戳、 utc Data类型
Vue.filter('dateFormat', value => moment.utc(value * 1000 + 8 * 3600 * 1000).format('MM-DD HH:mm'));
Vue.filter('dateFormatYMDF', value => moment.utc(value * 1000 + 8 * 3600 * 1000).format('YYYY-MM-DD HH:mm'));
Vue.filter('dateFormatAll', value => moment(value).format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('dateFormatMonth', value => moment.utc(value).format('MM-DD'));

Vue.filter('dateFormatBIH', value => moment(value).format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('dateFormatBIHM', value => moment(value).format('YYYY-MM-DD HH:mm'));
Vue.filter('dateFormatTimeBIH', value => moment(value).format('HH:mm:ss'));
Vue.filter('dateFormatMonthHour', value => moment(value).format('MM-DD HH:mm:ss'));
Vue.filter('dateFormatT', (value) => {
    const zone = moment().zone() / 60; // 时区
    return moment(value).add(0 - zone, 'hours').format('MM-DD HH:mm:ss');
});
Vue.filter('dateFormatTYear', (value) => {
    const zone = moment().zone() / 60; // 时区
    return moment(value).add(0 - zone, 'hours').format('YYYY-MM-DD HH:mm:ss');
});
Vue.filter('hidden', (str, frontLen = 6, endLen = 4) => {
    if (!!str) {
        return (
            str.substring(0, frontLen) +
            "..." +
            str.substring(str.length - endLen)
        );
    }
    return ''
})
