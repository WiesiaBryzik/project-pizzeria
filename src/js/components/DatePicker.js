import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import { utils } from '../utils.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    //zainicjowanie pluginu ?????
    // date.config.onChange.push(function(dateStr, flatpickr) { thisWidget.value = dateStr;

    //   flatpickr(thisWidget.dom.input, {
    //     defaultDate: thisWidget.minDate,
    //     minDate: thisWidget.minDate,
    //     maxDate: thisWidget.maxDate,
    //     'locale': {
    //       'firstDayOfWeek': 1
    //     },
    //     'disable': [function (date) {
    //       return (date.getDay() === 1);
    //     }],

    //   });
    //   //w momencie wykrycia zmiany wartości przez plugin,
    //   //chcemy ustawiać wartość właściwości thisWidget.value
    //   //na dateStr widoczne w dokumentacji pluginu.
    // } );
  }

  parseValue(value) {
    return value;
  }

  isValid(value) {
    return isNaN(value);
  }

  // metoda renderValue również nie będzie nam potrzebna –
  //możesz ją stworzyć z pustą wartością, tylko po to,
  //aby nadpisać domyślną metodę w BaseWidget (alternatywnie,
  //możesz w metodzie BaseWidget.renderValue zakomentować console.log).

  renderValue() {

  }
}

export default DatePicker;
