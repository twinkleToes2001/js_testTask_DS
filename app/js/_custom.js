// UPD: Знаю, нагородил тут много всего, уверен, можно сделать гораздо красивее, чище и опрятнее
// Но, к сожалению, пока что не знаю как, (не до конца понимаю как тут все работает, до этого мини-проекта имел дело
// только с консольными прилажениями (C#, Java и тп), а тут JS со своими событиями и подобным непривычным контентом
// но вроде работает ¯\_(ツ)_/¯
document.addEventListener('DOMContentLoaded', function() {

	const form = document.getElementById('form-feedback'),
		fullName_input = 	document.querySelector('.form__full-name'),
		phoneNumber_input = document.querySelector('.form__phone-number'),
		email_input =		document.querySelector('.form__email'),
		submit_button =		document.querySelector('.form__submit'),
		response_window =	document.querySelector('.form-response'),
		response_status =	document.querySelector('.form-response__status'),
		response_desc =		document.querySelector('.form-response__desc');

	// Убираем красные/зеленые рамки вокруг инпута
	function removeInputStatus(input) {
		input.classList.remove('invalid');
		input.classList.remove('valid');
	}

	// Берем инпуты и проверяем их на валидность
	// (появление красной/зеленой рамки) при потере фокуса
	let inputs = [fullName_input, phoneNumber_input, email_input]

	for (let input of inputs) {

		input.addEventListener('blur', function() {
	        let input_type = this.type;
	        let input_value = this.value;
	        let validation;

			// Чтобы не делать красную рамку из-за пустой строки
			if (input_value !== '') {
				switch (input_type) {
					case 'text':
						// Проверяется лишь на остутствие нелегитимных символов
						validation = /^[А-ЯЁ\-\sа-яё]+$/g.test(input_value);
					break;
					case 'tel':
						// Делаю без какой-либо конкретной маски, тк в ТЗ это не указано
						// Проверяется лишь на остутствие нелегитимных символов
						validation = /^\+?(\d|(-|\s))+$/g.test(input_value);
					break;
					case 'email':
						// Самая простая регулярка для проверки email
						validation = /^[A-Za-z0-9_.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/g.test(input_value);
					break;
				}
				removeInputStatus(this);

				if (validation) {
					this.classList.add('valid');
				}
				else {
					this.classList.add('invalid');
				}	
			}
		});
		
		input.addEventListener('focus', function() {
			removeInputStatus(this);
		});
	}

	submit_button.addEventListener('click', event => {
		event.preventDefault()

		let form_valid = true
		for (let input of inputs) {
			if (input.value === '') {
				input.classList.add('invalid');
				form_valid = false
			}
			if (input.classList.contains('invalid')) {
				form_valid = false
			}
		}
		if (form_valid) {
			sendFormAjax(form);
		}
	});

	// Ajax implementation
	function sendFormAjax(form_,
						  form_method= form.getAttribute('method'),
						  form_action= form.getAttribute('action'))
	{
		const form_data = new FormData(form_)
		const xhr = new	XMLHttpRequest()

		xhr.open(form_method, form_action)

		xhr.onload = () => {
			if (xhr.status >= 400) {
				response_status.innerHTML = "HTTP Ошибка!"
				response_desc.innerHTML = `${xhr.status}:${xhr.statusText}:${xhr.response}`
			} else if (xhr.status === 201) {
				response_window.style.borderColor = 'green'
				response_status.innerHTML = "Форма успешно отправлена!"
				response_desc.innerHTML = `${xhr.status}:${xhr.statusText}:${xhr.response}`
			} else {
				response_status.innerHTML = "Похоже, ничего не произошло.."
			}
			response_window.style.transform = 'translate(-50%, 0)'
			setTimeout(() => {
				response_window.style.transform = 'translate(-50%, calc(-100% + -31px))'
			}, 2000)
		}

		xhr.onerror = () => {
			response_status.innerHTML = "Ошибка сети!"
			response_desc.innerHTML = `${xhr.status}:${xhr.statusText}:${xhr.response}`
		}

		xhr.send(form_data)
	}

	// В этом году решил все делать по ТЗ, без импровизации.
	// В прошлый раз пытался подогнать валидацию формы под
	// Российские данные:
	// 1) Использовал конкретную телефонную маску.
	// Сейчас - проверка только на отсутствие символов, оговоренных в ТЗ
	// 2) Поле с ФИО обязательно содержало ТРИ слова.
	// Сейчас - проверка только на отсутствие символов, оговоренных в ТЗ

	// JS получился значительно короче и проще, но стабильнее.
	// И вот не знаю, в плюс это или в минус.
	// Не ясно что важнее - соблюсти ТЗ или
	// продемонстрировать заинтересованность, и сымпровизировать

	// Поэтому сажусь сразу на два стула:
	// 1) Это решение максимально соблюдает ТЗ
	// 2) Решение ниже - демонстрация некого упорства и попытки сделать что-то эдакое


	// Функции и некоторая часть прошлогоднего решения:

	// // Прямой запрет на ввод нелегитимных символов
	// email_input.addEventListener('keydown', event => {
	// 	if (!(/[A-Za-z0-9_.%+-@ ]+/.test(event.key)) && event.key.length === 1) {
	// 		event.preventDefault();
	// 	}
	// });

	// // Попробовал сделать прямой запрет на ввод неуместных символов
	// // как говорится - реализация подкачала, но в целом работает
	// fullName_input.addEventListener('keydown', event => {
	// 	if (!(/[а-яА-яЕё -]+/.test(event.key)) && event.key.length === 1) {
	// 		// Проверка event.key.length == 1 для использования backspace, alt, tap и тп
	// 		// потому что он их тоже блокирует, хотел использовать keypress, но узнал
	// 		// что его не рекомендуют использовать
	// 		event.preventDefault();
	// 	}
	// });

	// // Перевод строки в Capitalize
	// function toTitleCase(str) {
	// 	return str.replace(
	// 		/[а-яА-ЯЁё]\S*/g,
	// 		function(txt) {
	// 			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	// 		}
	// 	);
	// }

	// // Автоматический капиталайз ФИО при вводе
	// fullName_input.addEventListener('input', function() {
	// 	this.value = toTitleCase(this.value);
	// });

	// // Маска для телефона пользователя
	// function mask(event) {
	// 	let phonePattern = '+7(___) ___-__-__',
	// 		i = 0,
	// 		defaultValue = phonePattern.replace(/\D/g, ''),
	// 		currentValue = this.value.replace(/\D/g, '');
	//
	// 	// Ставим семерку вначале
	// 	if (defaultValue.length >= currentValue.length)
	// 		currentValue = defaultValue;
	//
	// 	// Непосредственно замена маски на символы пользователя
	// 	this.value = phonePattern.replace(/./g, function(a) {
	// 		return /[_\d]/.test(a) && i < currentValue.length ? currentValue.charAt(i++) : i >= currentValue.length ? '' : a;
	// 	});
	//
	// 	if (event.type === 'blur')
	// 	{
	// 		//Убираем часть шаблона (<+7>) когда теряем фокус
	// 		if (this.value.length === 2)
	// 			this.value = '';
	// 	}
	// }

	// // Навешиваем событие на инпут с номером телефона
	// phoneNumber_input.addEventListener('input', mask);
	// phoneNumber_input.addEventListener('focus', mask);
	// phoneNumber_input.addEventListener('blur', mask);

	// При таком сетапе, при редактировании НЕ последнего символа полей <name> и <phone>
	// скачет каретка, не знаю как это поправить из-за поверхностных знаний
});
