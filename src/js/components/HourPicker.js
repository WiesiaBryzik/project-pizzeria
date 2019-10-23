import BaseWidget from './BaseWidget.js';
import { select, settings } from '../settings.js';
import {utils} from '../utils.js';
// import data from "./data.js";
// import rangeslider from "rangeslider-pure";
// import "rangeslider-pure/dist/range-slider.min.css";

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapper;


    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.value = settings.hours.open;
    thisWidget.initPlugin(thisWidget.value);

  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input, {
      onSlide: function(value) {
        thisWidget.value = value;
      },
    });

    // dla elementu thisWidget.dom.input dodaj listener eventu 'input'.
    // W handlerze tego eventu przypisz wartości widgetu (thisWidget.value) wartość tego elementu.
    // thisWidget.dom.input.addEventListener('input', function(){
    //   thisWidget.value = thisWidget.dom.input.value; //powtórzone w konstruktorze
    // });
  }

  parseValue(newValue) {
    // Metoda parseValue ma przekazywać otrzymaną wartość do funkcji utils.numberToHour
    // i zwracać wartość otrzymaną z tej funkcji. Ta funkcja zamienia liczby na zapis godzinowy,
    //czyli np. 12 na '12:00', a 12.5 na '12:30'.
    return utils.numberToHour(newValue);
  }

  isValid() {
    // Metoda isValid może zawsze zwracać prawdę true.
    return true;
  }

  renderValue() {
    const thisWidget = this;
    // Metoda renderValue ma zamieniać zawartość elementu thisWidget.dom.output na wartość widgetu.
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }

}

// class App {
//   constructor() {
//     this.dom = {};
//     this.dom.input = document.querySelector("#input");
//     this.dom.availabilityRangeSlider = document.querySelector("#availability");
//     this.events = data;
//     this.value = 12;
//     this.booked = {};
//     this.date = "2019-01-01";
//     this.open = 12;
//     this.close = 24;
//     this.table = 1;

//     this.initWidget();
//     this.parseData();
//   }

//   initWidget() {
//     rangeslider.create(this.dom.input, {
//       onSlide: value => {
//         this.value = value;
//       }
//     });
//   }

//   makeBooked(date, hour, duration, table) {
//     if (!this.booked[date]) {
//       this.booked[date] = {};
//     }

//     let time = hour.split(":");
//     if (time[1] === "30") hour = `${time[0]}.5`;
//     else hour = time[0];

//     if (!this.booked[date][hour]) {
//       this.booked[date][hour] = [];
//     }

//     this.booked[date][hour].push(table);

//     hour = hour - -duration;

//     if (!this.booked[date][hour]) {
//       this.booked[date][hour] = [];
//     }

//     this.booked[date][hour].push(table);
//   }

//   parseData() {
//     console.log(this.data);
//     for (let event of this.events) {
//       this.makeBooked(event.date, event.hour, event.duration, event.table);
//     }

//     this.initTableAvailability();
//   }

//   initTableAvailability() {
//     console.log(this.booked);

//     const tableAvailability = [];
//     for (let i = this.open; i < this.close; i += 0.5) {
//       if (this.booked[this.date][i]) {
//         this.booked[this.date][i].push[this.table];
//       } else {
//         this.booked[this.date][i] = [];
//       }
//       tableAvailability.push(this.booked[this.date][i].length);
//     }

//     for (let i = 0; i < tableAvailability.length; i++) {
//       const divRangeSlider = document.createElement("div");
//       divRangeSlider.classList.add("availability-div");
//       if (tableAvailability[i] === 1 || tableAvailability[i] === 2) {
//         divRangeSlider.classList.add("medium");
//       } else if (tableAvailability[i] === 3) {
//         divRangeSlider.classList.add("full");
//       } else {
//         divRangeSlider.classList.add("empty");
//       }
//       this.dom.availabilityRangeSlider.appendChild(divRangeSlider);
//     }
//   }
// }

// new App();

export default HourPicker;
