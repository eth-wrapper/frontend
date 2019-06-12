import Vue from 'vue'
import commafy from '~/utils/commafy'
import moment from 'moment'

Vue.filter('commafy', commafy);

Vue.filter('round', function (value, digits) {
  if(digits === undefined)
    digits = 4;
  let base = Math.pow(10, digits);
  return Math.round(value * base) / base;
});

Vue.filter('std_datetime', function (value) {
  if(!!value)
    return moment(value).format('YYYY-MM-DD HH:MM');
  else
    return value;
});


