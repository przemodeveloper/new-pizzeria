import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    //console.log('new product: ', thisProduct);
  }

  renderInMenu() {
    const thisProduct = this;

    /* generate HTML based on template */

    const generatedHTML = templates.menuProduct(thisProduct.data);
    //console.log(generatedHTML);

    /* create element using utils.createElementFromHTML */

    thisProduct.element = utils.createDOMFromHTML(generatedHTML);


    /* find menu container */

    const menuContainer = document.querySelector(select.containerOf.menu);


    /* add element to menu */

    menuContainer.appendChild(thisProduct.element);

  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelectorAll(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    //console.log('price', thisProduct.priceElem);
    //console.log('formInputs', thisProduct.formInputs);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */

    const clickableTrigger = thisProduct.element;

    /* START: click event listener to trigger */

    thisProduct.accordionTrigger.addEventListener('click', function(event) {

      /* prevent default action for event */

      event.preventDefault();

      /* toggle active class on element of thisProduct */

      clickableTrigger.classList.add(classNames.menuProduct.wrapperActive);

      /* find all active products */

      const activeProducts = document.querySelectorAll('.product');
          
      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {

        /* START: if the active product isn't the element of thisProduct */

        if (activeProduct != clickableTrigger) {

          /* remove class active for the active product */

          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);

          /* END: if the active product isn't the element of thisProduct */
            
        }

        /* END LOOP: for each active product */

      }

      /* END: click event listener to trigger */
        
    });

  }

  initOrderForm() {
    const thisProduct = this;
      
    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });

    }

    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });

  }

  processOrder() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);

    thisProduct.params = {};
      
    let price = thisProduct.data.price;
      
    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
        

      for (let optionId in param.options) {
        const option = param.options[optionId];

        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        if (optionSelected && !option.default) {

          price = price + option.price;
            
        } else if (!optionSelected && option.default) {

          price = price - option.price;

        }

        const images = document.querySelectorAll('.' + paramId + '-' + optionId);

        if (optionSelected) {

          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }

          thisProduct.params[paramId].options[optionId] = option.label;

          for (let image of images) {

            image.classList.add(classNames.menuProduct.imageVisible);

          }

        } else {

          for (let image of images) {

            image.classList.remove(classNames.menuProduct.imageVisible);

          }

        }

      }

    }

    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    thisProduct.priceElem.innerHTML = thisProduct.price;

    //console.log('params', thisProduct.params);
      
  }

  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('click', function() {

      thisProduct.processOrder();

    });

  }

  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);

  }

}

export default Product;