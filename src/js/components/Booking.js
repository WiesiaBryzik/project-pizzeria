import { templates, select, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking {
  constructor(wrapper) {
    const thisBooking = this;
    // DONE konstruktor ma wywoływać metodę render, przekazując jej argument,
    //który otrzymuje z app.initBooking,

    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking
        + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsRepeat.join('&'),
    };

    // console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  initTableAvailability() {
    const thisBooking = this;
    console.log(thisBooking.booked);

    const tableAvailability = [];
    for (let i = this.open; i < this.close; i += 0.5) {
      if (thisBooking.booked[thisBooking.date][i]) {
        thisBooking.booked[thisBooking.date][i].push[thisBooking.table];
      } else {
        thisBooking.booked[thisBooking.date][i] = [];
      }
      tableAvailability.push(thisBooking.booked[thisBooking.date][i].length);
    }

    for (let i = 0; i < tableAvailability.length; i++) {
      const divRangeSlider = document.createElement('div');
      divRangeSlider.classList.add('availability-div');
      if (tableAvailability[i] === 1 || tableAvailability[i] === 2) {
        divRangeSlider.classList.add('medium');
      } else if (tableAvailability[i] === 3) {
        divRangeSlider.classList.add('full');
      } else {
        divRangeSlider.classList.add('empty');
      }
      this.dom.availabilityRangeSlider.appendChild(divRangeSlider);
    }
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
    this.initTableAvailability();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (!thisBooking.booked[date]) {
      thisBooking.booked[date] = {};
    }

    hour = hour + '';
    let time = hour.split(':');
    if (time[1] === '30') hour = `${time[0]}.5`;
    else hour = time[0];

    if (!thisBooking.booked[date][hour]) {
      thisBooking.booked[date][hour] = [];
    }

    thisBooking.booked[date][hour].push(table);

    hour = hour - (-duration);

    if (!thisBooking.booked[date][hour]) {
      thisBooking.booked[date][hour] = [];
    }

    thisBooking.booked[date][hour].push(table);

    console.log('BOOKED', thisBooking.booked);

  }

  // makeBooked(date, hour, duration, table) {
  //   const thisBooking = this;

  //   if (typeof thisBooking.booked[date] == 'undefined') {
  //     thisBooking.booked[date] = {};
  //   }

  //   const startHour = utils.hourToNumber(hour);

  //   for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
  //     console.log('loop', hourBlock);

  //     if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
  //       thisBooking.booked[date][hourBlock] = [];
  //     }

  //     thisBooking.booked[date][hourBlock].push(table);
  //   }
  // }



  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    for (let table of thisBooking.dom.tables) {
      const tableNumber = parseInt(table.getAttribute(settings.booking.tableIdAttribute));
      if (thisBooking.booked[thisBooking.date] && thisBooking.booked[thisBooking.date][thisBooking.hour] && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableNumber)) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  // updateDOM(){
  //   const thisBooking = this;

  //   thisBooking.date = thisBooking.datePicker.value;
  //   thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

  //   let allAvailable = false;

  //   if(
  //     typeof thisBooking.booked[thisBooking.date] == 'undefined'
  //     ||
  //     typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
  //   ){
  //     allAvailable = true;
  //   }

  //   for(let table of thisBooking.dom.tables){
  //     let tableId = table.getAttribute(settings.booking.tableIdAttribute);
  //     if(!isNaN(tableId)){
  //       tableId = parseInt(tableId);
  //     }

  //     if(
  //       !allAvailable // czy którys stolik jest zajęty
  //       && // jesli tak to
  //       thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) // czy tego dnia o tej godz zajety jest stolik o tym id
  //     ){
  //       table.classList.add(classNames.booking.tableBooked);
  //     } else {
  //       table.classList.remove(classNames.booking.tableBooked);
  //     }
  //   }
  // }

  render(wrapper) {
    const thisBooking = this;

    // DONE generate HTML based on template
    const generatedHTML = templates.bookingWidget();

    // DONE create empty obiect thisBooking.dom
    thisBooking.dom = {};

    // DONE zapisywać do tego obiektu właściwość wrapper równą otrzymanemu argumentowi,
    thisBooking.dom.wrapper = wrapper;

    // DONE zawartość wrappera zamieniać na kod HTML wygenerowany z szablonu,
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    // DONE we właściwości thisBooking.dom.peopleAmount zapisywać pojedynczy element
    // znaleziony we wrapperze i pasujący do selektora select.booking.peopleAmount,
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    // DONE analogicznie do peopleAmount znaleźć i zapisać element dla hoursAmount.
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    // DONE stwórz właściwość thisBooking.dom.datePicker i zapisz w niej element
    // pasujący do selektora zapisanego w select.widgets.datePicker.wrapper,
    // wyszukany we wrapperze zapisanym w tej klasie.
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  initWidgets() {

    // DONE Metoda Booking.initWidgets powinna:
    // we właściwościach thisBooking.peopleAmount i thisBooking.hoursAmount
    // zapisywać nowe instancje klasy AmountWidget, którym jako argument
    //przekazujemy odpowiednie właściwości z obiektu thisBooking.dom.

    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.table = '';
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector('.booking-form');

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });

    //MOJE
    // Na pewno chcemy wprowadzić możliwość zaznaczenia dostępnego stolika za pomocą kliknięcia.
    // Jeśli potem użytkownik zmieni datę lub godzinę, zaznaczenie powinno być usuwane.
    // table.addEventListener('click', function(){
    //   table.classList.add('active');
    // });

    // zaznaczanie stolików
    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function () {
        if (thisBooking.table) {
          document.querySelector('[data-table="' + thisBooking.table +
            '"]').classList.remove(classNames.booking.tableBooked);
        }
        let id = table.getAttribute('data-table');
        table.classList.add(classNames.booking.tableBooked);
        thisBooking.table = id;
      });
    }

    // MOJE uniemożliwienie rezerwacji tego samego stolika
    // if (thisBooking.sendReservation()){
    // table.classList.add(classNames.booking.tableBooked);
    // }

    // MOJE 2
    // Wywołanie sendReservation???
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendReservation();
    });
  }

  // ?? MOJE 1
  // przekazywanie do API rezerwacji stolika?
  sendReservation() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    thisBooking.starters = thisBooking.dom.wrapper.querySelectorAll('input[name="starter"]');

    const bookinfo = {
      address: 'ul. Warszawska, Warszawa',
      phone: '987654321',
      date: thisBooking.date,
      hour: thisBooking.hour,
      table: thisBooking.table,
      repeat: false,
      duration: thisBooking.hoursAmount,
      ppl: thisBooking.peopleAmount,
      starters: []
    };

    for (let starter of thisBooking.starters) {
      let name = '';
      if (starter.checked) {
        name = starter.value;
      }
      bookinfo.starters.push(name);
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookinfo),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Booking;
