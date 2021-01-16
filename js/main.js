'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth'),
modalAuth = document.querySelector('.modal-auth'),
closeAuth = document.querySelector('.close-auth'),
logInForm = document.querySelector('#logInForm'),
loginInput = document.querySelector('#login'),
userName = document.querySelector('.user-name'),
buttonOut = document.querySelector('.button-out'),
cardsRestaurants = document.querySelector('.cards-restaurants'),
containerPromo = document.querySelector('.container-promo'),
restaurants = document.querySelector('.restaurants'),
menu = document.querySelector('.menu'),
orderForm = document.querySelector('.orderForm'),
cardsMenu = document.querySelector('.cards-menu'),
formTotalPrice = document.querySelector('.total_price'),
productName = document.querySelector('.product_name'),
minPrice = document.querySelector('.price'),
category = document.querySelector('.category'),
inputSearch = document.querySelector('.input-search'),
modalBody = document.querySelector('.modal-body'),
modalPrice = document.querySelector('.modal-pricetag'),
buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('Goods');
const cart = [];
 
const getData = async function(url) {

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных с ${url}, статус: ${response.status}`)
    }

    return response.json();
};


function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
}

function autorized () {
  console.log('авторизован');
  
    function logOut() {
      login = null;
      localStorage.removeItem('Goods');
      buttonAuth.style.display = '';
      userName.style.display = '';
      buttonOut.style.display = '';
      cartButton.style.display = '';
      buttonOut.removeEventListener('click', logOut);
      checkAuth();
    }
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}
function notAautorized () {
  console.log('не авторизован');

function logIn(event) {
  event.preventDefault();

  if (loginInput.value) {
  login = loginInput.value;

  localStorage.setItem('Goods',login);
  toggleModalAuth();
  buttonAuth.removeEventListener('click', toggleModalAuth);
  closeAuth.removeEventListener('click', toggleModalAuth);
  logInForm.removeEventListener('submit', logIn);
  logInForm.reset(); 
  checkAuth();
  } else {
    loginInput.style.borderColor = 'red';
  }
}


buttonAuth.addEventListener('click', toggleModalAuth);
closeAuth.addEventListener('click', toggleModalAuth);
logInForm.addEventListener('submit', logIn);
cardsRestaurants.removeEventListener('click', openGoods);
}

function checkAuth() {
  login ?  autorized() :  notAautorized();
}




function createCardGood({ name, img, price }) {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend',  `
  <img src="${img}" alt="${name}" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
    </div>
    <strong class="card-price-bold card-price">${price} ₽</strong>
    <div class="card-buttons">
      <button class="button button-primary button-add-cart" id="1">
        <span class="button-card-text">В корзину</span>
        <span class="button-cart-svg"></span>
      </button>
    </div>
  </div>
`);
cardsMenu.insertAdjacentElement('beforeend',card);

}

function openGoods(event){
  const target = event.target;

  //closest ходит по родителям, пока не найдёт указанный селектор
  const restaurant = target.closest('.card-restaurant');
  if (restaurant) {
    const [name, price, stars, kitchen] = restaurant.info;

      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      cardsMenu.textContent = '';
    
      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;

    getData(`./db/${restaurant.products}`).then(function(data) {
      data.forEach(createCardGood);
      });
      
  }
 
}



function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function(item) {
      return item.id === id;
    });
    productName.value = title;
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
 
  }
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `<div class="modal-body">
        <div class="food-row">
          <span class="food-name">${title}</span>
          <strong class="food-price">${cost}</strong>
          <div class="food-counter">
            <button class="counter-button counter-minus" data-id=${id}>-</button>
            <span class="counter">${count}</span>
            <button class="counter-button counter-plus" data-id=${id}>+</button>
          </div>
        </div>`;
        modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });
 const totalPrice = cart.reduce(function(result, item) {
   return result + (parseFloat(item.cost) * item.count); 
  }, 0);
  modalPrice.textContent = totalPrice + ' ₽';
  formTotalPrice.value = totalPrice + ' ₽';
}

function changeCount(event) {
  const target = event.target;
  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) {
      food.count++;
    }
    renderCart();
  }

}

function init() {
  getData('./db/product.json').then(function(data) {
    data.product.forEach(createCardGood);
    });
    
    cartButton.addEventListener('click', function() {
      renderCart();
      toggleModal();
    });
    modalBody.addEventListener('click', changeCount);
    close.addEventListener("click", toggleModal);
    
    buttonClearCart.addEventListener('click', function () {
      cart.length = 0;
      renderCart();
    })
    cardsMenu.addEventListener('click', (e) => {
      addToCart(e);
      renderCart();
      toggleModal();
    });
    cardsMenu.addEventListener('click', function() {
      
      !login ? toggleModalAuth() :  openGoods;
    });

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log( `Заказ отправлен: ${productName.value} на сумму ${formTotalPrice.value} `);
    });

    checkAuth();
}

init();