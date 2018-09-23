var d = document,
    itemBox = d.querySelectorAll('.item_box'), // блок кожного товару
		cartCont = d.getElementById('cart_content'); // блок виводу даних кошику
// Функція кроссбраузерна установка обробки подій
function addEvent(elem, type, handler){
  if(elem.addEventListener){
    elem.addEventListener(type, handler, false);
  } else {
    elem.attachEvent('on'+type, function(){ handler.call( elem ); });
  }
  return false;
}
// отримуєм дані з LocalStorage
function getCartData(){
	return JSON.parse(localStorage.getItem('cart'));
}
// записуєм дані в LocalStorage
function setCartData(o){
	localStorage.setItem('cart', JSON.stringify(o));
	return false;
}
// Добавляєм товар в кошик
function addToCart(e){
	this.disabled = true; // блокуємо кнопку на час операції з кошиком
	var cartData = getCartData() || {}, // отримуєм дані кошику або створюєм новий об'єкт, якщо даних ще не має
			parentBox = this.parentNode, // батьківський елемент кнопки "добавити в кошик"
			itemId = this.getAttribute('data-id'), // ID товару
			itemTitle = parentBox.querySelector('.item_title').innerHTML, // назва товару
			itemPrice = parentBox.querySelector('.item_price').innerHTML; // ціна товару
	if(cartData.hasOwnProperty(itemId)){ // якщо такий товар вже в кошику, то добавляєм +1 до його кількості
		cartData[itemId][2] += 1;
	} else { // якщо товару в кошику ще не має, то добавляєм в об'ект
		cartData[itemId] = [itemTitle, itemPrice, 1];
	}
	// Обновляєм данні в LocalStorage
	if(!setCartData(cartData)){ 
		this.disabled = false; // розблоковуємо кнопку після обновлння LS
		cartCont.innerHTML = 'Товар добавлен в корзину.';
		setTimeout(function(){
			console.log("after add item")
			cartCont.innerHTML = 'Продолжить покупки...';
		});
	}
	return false;
}
// встановлюєм обробку подій на кожну кнопку "добавити в кошик"
for(var i = 0; i < itemBox.length; i++){
	addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
}
// Відкриваєм кошик зі списком добавлених товарів
function openCart(e){
	
	var cartData = getCartData(), // витягуєм всі дані кошику
			totalItems = '';
	console.log(JSON.stringify(cartData));
	// якщо в кошику є товар, починаємо формувати дані для виводу
	if(cartData !== null){
		totalItems = '<table class="shopping_list"><tr><th>Наименование</th><th>Цена</th><th>Кол-во</th></tr>';
		for(var items in cartData){
			totalItems += '<tr>';
			for(var i = 0; i < cartData[items].length; i++){
				totalItems += '<td>' + cartData[items][i] + '</td>';
			}
			totalItems += '</tr>';
		}
		totalItems += '<table>';
		cartCont.innerHTML = totalItems;
	} else {
		// якщо в кошику порожньо, то показуєм 
		cartCont.innerHTML = 'В корзине пусто!';
	}
	return false;
}
/* Відкрити кошик */
addEvent(d.getElementById('checkout'), 'click', openCart);
/* Очистити кошик */
addEvent(d.getElementById('clear_cart'), 'click', function(e){
	localStorage.removeItem('cart');
	cartCont.innerHTML = 'Корзина очишена.';	
});