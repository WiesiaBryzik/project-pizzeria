import BaseWidget from './BaseWidget.js';
import { settings, select } from '../settings.js';
import {utils} from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input;
  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    // dla elementu thisWidget.dom.input dodaj listener eventu 'input'.
    // ??? W handlerze tego eventu przypisz wartości widgetu (thisWidget.value) wartość tego elementu.
    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input; //powtórzone w konstruktorze
    });

  }

  parseValue(value) {
    // ?? Metoda parseValue ma przekazywać otrzymaną wartość do funkcji utils.numberToHour
    // i zwracać wartość otrzymaną z tej funkcji. Ta funkcja zamienia liczby na zapis godzinowy,
    //czyli np. 12 na '12:00', a 12.5 na '12:30'.
    const numberToHour = utils.numberToHour(value);

    return numberToHour;
  }

  isValid(value) {
    // Metoda isValid może zawsze zwracać prawdę true.
    return isNaN(value);
  }

  renderValue() {
    const thisWidget = this;
    // Metoda renderValue ma zamieniać zawartość elementu thisWidget.dom.output na wartość widgetu.
    thisWidget.dom.output = thisWidget.value;
  }

}

export default HourPicker;
