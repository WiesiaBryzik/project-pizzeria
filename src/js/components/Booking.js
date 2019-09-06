import AmountWidget from './AmountWidget';
import {select} from '../settings.js';

class Booking {
  constructor(element){
    const thisBooking = this;
    //??? konstruktor ma wywoływać metodę render, przekazując jej argument,
    //który otrzymuje z app.initBooking,
    thisBooking.render(reservations);
    thisBooking.initWidget();

  }

  render(){
    const thisBooking = this;

    // generate HTML based on template
    const generatedHTML = templates.bookingWidget();

    // create empty obiect thisBooking.dom
    thisBooking.dom = {};

    // ?? zapisywać do tego obiektu właściwość wrapper równą otrzymanemu argumentowi,
    thisBooking.dom.wrapper = element;

    // ?? zawartość wrappera zamieniać na kod HTML wygenerowany z szablonu,
    thisBooking.dom.wrapper = generatedHTML;

    // we właściwości thisBooking.dom.peopleAmount zapisywać pojedynczy element
    // znaleziony we wrapperze i pasujący do selektora select.booking.peopleAmount,
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);

    //analogicznie do peopleAmount znaleźć i zapisać element dla hoursAmount.
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
  }

  initWidget() {

    // Metoda Booking.initWidgets powinna:
    // we właściwościach thisBooking.peopleAmount i thisBooking.hoursAmount
    // zapisywać nowe instancje klasy AmountWidget, którym jako argument
    //przekazujemy odpowiednie właściwości z obiektu thisBooking.dom.

    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;
