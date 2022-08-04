const modal = document.querySelector('#modal');
const content = document.querySelector('#content');
const backDrop = document.querySelector('#backDrop');
const progress = document.querySelector('#progress');
const form = document.querySelector('#form');
content.addEventListener("click", openCard);
backDrop.addEventListener('click', closeModal);
modal.addEventListener('change', toggleTech);
form.addEventListener('submit', createTech);
//для изменения ttile в адресной строке
const APP_TITLE = document.title
const LS_KEY = 'MY_TECHS';
//функция запоминания состояния
function saveState() {
	localStorage.setItem(LS_KEY, JSON.stringify(technologies))
}
//функция получения состояния
function getState() {
	raw = localStorage.getItem(LS_KEY);
	return raw ? JSON.parse(raw) : [];
}

//массив куда будут добавляться создаваемые на странице технологии
//вместо пустого массива показываем то состояние которое сохранилось до этого в localStorage
const technologies = getState();


function openCard(event) {
	const data = event.target.dataset;//получаем по клику дата атрибут того элемента на который кликнули
	console.log(data.type);
	const tech = technologies.find(t => t.type === data.type);//сверяем его есть ли он в массиве технологий
	if (!tech) return;//если его нет то ничего не делаем
	openModal(modal, toModal(tech), tech.title);//иначе открывем попап
}
function toModal(tech) {

	const checked = tech.done ? 'checked' : '';//если в массиве технология done ===true то в константу checked записываем 'checked' иначе пустая строка
	//возвращаем разметку попапа
	return `<h2>${tech.title}</h2>
	<p>
	${tech.description}
	</p>
	<hr />
	<div>
		<input type="checkbox" id="done" ${checked} data-type="${tech.type}"/>
		<label for="done">Выучил</label>
	</div>`
}
function openModal(element, html, title = APP_TITLE) {

	document.title = `${title} | ${APP_TITLE}`
	element.innerHTML = html;
	element.classList.add('open');
}
function closeModal() {
	document.title = `${APP_TITLE}`;
	modal.classList.remove('open');
}
function toggleTech(event) {
	const type = event.target.dataset.type;//получаем в переменную тип технологии чекбокса по которому кликаем
	const tech = technologies.find(t => t.type === type);//ищем его в массиве технологий
	tech.done = event.target.checked;//меняем на обратный
	saveState();
	init();//перерисовываем страничку для отображения изменений
}
//основная функция
function init() {
	renderCards();
	renderProgress();
}
//функция отрисовки карт
function renderCards() {
	//если в массиве нет технологий то выводим запись "добавьте технологию"
	if (technologies.length === 0) {
		content.innerHTML = `<p>Добавьте технологию</p>`
	}
	//иначе в строку html записываем технологию
	else {
		let html = '';
		for (let i = 0; i < technologies.length; i++) {
			const tech = technologies[i];
			html += toCard(tech)
		}
		//и в блок content добавляем полученную строку
		content.innerHTML = html;
		/* content.innerHTML = technologies.map(toCard).join(''); *///?тоже что и выше только с пом метода map()
	}
}
//функция отрисовки прогресс бара
function renderProgress() {
	const persent = computprogressPersent();
	let background;
	if (persent <= 30) {
		background = '#e75a5a';
	}
	else if (persent > 30 && persent < 70) {
		background = '#f99415';
	}
	else {
		background = '#73ba3c';
	}
	progress.style.background = background;
	progress.style.width = persent + '%';
	progress.textContent = persent ? persent + '%' : '';//если процент не ноль то пишем количество процентов со знаком процент,если ноль то пустая строка
}
//функция вычисляющая сколько процентов технологий выучено
function computprogressPersent() {
	if (technologies.length == 0) {
		return 0;
	}
	let doneCount = 0;
	for (let i = 0; i < technologies.length; i++) {
		if (technologies[i].done === true) {
			doneCount++;
		}
	}
	return Math.round((100 * doneCount) / technologies.length);
}
//функция создания карточки
function toCard(tech) {
	const doneClass = tech.done ? 'done' : '';//если tech.done===true то добавляется класс done иначе пустая строка
	return `<div class="card ${doneClass}" data-type="${tech.type}">
	<h3 data-type="${tech.type}">${tech.title}</h3>
</div> `;
}
function isInvalid(title, description) {

	return !title.value || !description.value
}
function createTech(event) {
	event.preventDefault();//отменяет поведение по умолчанию
	const title = event.target.title;//получаем поле с name=title во время события взаимодействия с формой
	const description = event.target.description;//получаем поле с name=description во время события взаимодействия с формой

	/* const { title, description } = event.target; *///?тоже что изапись выше но с пом деструктуризации
	if (isInvalid(title, description)) {

		if (!title.value) {
			title.classList.add('invalid');
		}
		if (!description.value) {
			description.classList.add('invalid');
		}
		setTimeout(() => {
			title.classList.remove('invalid');
			description.classList.remove('invalid');
		}, 2000);
		return
	}
	//создаем новую технологию с пом объекта newTech
	const newTech = {
		title: title.value,//title берем из const title = event.target.title
		description: description.value,//description берем из const description = event.target.description
		done: false,//по умолчанию false так как технология которую создали еще не выучена
		type: title.value.toLowerCase()//тип берем из const title = event.target.title только маленькими буквами
	};
	technologies.push(newTech);//добавляем созданную технологию в изначальный массив technologies


	title.value = '';//очищаем поля
	description.value = '';//очищаем поля
	saveState();
	init();
}
init();