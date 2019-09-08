import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import {utils} from '../utils.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    //??? konstruktor ma wywoływać metodę render, przekazując jej argument,
    //który otrzymuje z app.initBooking,
    thisBooking.render(element);
    thisBooking.initWidget();

  }

  render(element) {
    const thisBooking = this;

    // generate HTML based on template
    const generatedHTML = templates.bookingWidget();

    // create empty obiect thisBooking.dom
    thisBooking.dom = {};

    // ?? zapisywać do tego obiektu właściwość wrapper równą otrzymanemu argumentowi,
    thisBooking.dom.wrapper = element;

    // ?? zawartość wrappera zamieniać na kod HTML wygenerowany z szablonu,
    thisBooking.element = utils.createDOMFromHTML(generatedHTML);

    // ?? we właściwości thisBooking.dom.peopleAmount zapisywać pojedynczy element
    // znaleziony we wrapperze i pasujący do selektora select.booking.peopleAmount,
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);

    //analogicznie do peopleAmount znaleźć i zapisać element dla hoursAmount.
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    // stwórz właściwość thisBooking.dom.datePicker i zapisz w niej element
    // pasujący do selektora zapisanego w select.widgets.datePicker.wrapper,
    // wyszukany we wrapperze zapisanym w tej klasie.
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
  }

  initWidget() {

    // Metoda Booking.initWidgets powinna:
    // we właściwościach thisBooking.peopleAmount i thisBooking.hoursAmount
    // zapisywać nowe instancje klasy AmountWidget, którym jako argument
    //przekazujemy odpowiednie właściwości z obiektu thisBooking.dom.

    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    // Następnie w metodzie initWidgets stwórz nową instancję klasy DatePicker
    //zapisując ją do właściwości thisBooking.datePicker, analogicznie jak
    //zrobiliśmy to dla obu instancji AmountWidget

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }
}

export default Booking;
