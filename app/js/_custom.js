// UPD: Знаю, нагородил тут много всего, уверен, можно сделать гораздо красивее, чище и опрятнее
// Но, к сожалению, пока что не знаю как, (не до конца понимаю как тут все работает, до этого мини-проекта имел дело
// только с консольными прилажениями (C#, Java и тп), а тут JS со своими событиями и подобным непривычным контентом
// но вроде работает ¯\_(ツ)_/¯
document.addEventListener('DOMContentLoaded', function() {

	const 	fullName_input = 	document.querySelector('.form__full-name'),
			phoneNumber_input = document.querySelector('.form__phone-number'),
			email_input =		document.querySelector('.form__email');
	// Навешиваем событие(находится в самом конце) на поле с номером телефона
	phoneNumber_input.addEventListener('input', mask);
	phoneNumber_input.addEventListener('focus', mask);
	phoneNumber_input.addEventListener('blur', mask);

	// Берем все инпуты и проверяем их на валидность(появление красной/зеленой рамки) при потере фокуса
	let inputs = document.querySelectorAll('input[type]');

	for (let input of inputs) {

		input.addEventListener('blur', function() {
	        let input_type = this.type;
	        let input_value = this.value;
	        let validation;

			// Чтобы не делать красную рамку из-за пустой строки и вокруг сабмита
			if (input_value != '' && input_type != 'submit') {
				switch (input_type) {
					case 'text':
						validation = /^([А-ЯЁ]{1}[а-яё]+\s){2}([А-ЯЁ]{1}[а-яё]+\s*)$/g.test(input_value);
					break;
					case 'tel':
						validation = /^\+7\(\d{3}\) \d{3}-\d{2}-\d{2}$/g.test(input_value);
					break;
					case 'email':
						// Самая простая регулярка для проверки email
						validation = /^[A-Za-z0-9_.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/g.test(input_value);
					break;
				}
				this.classList.remove('invalid');
				this.classList.remove('valid');
				if (validation) {
					this.classList.add('valid');
				}
				else {
					this.classList.add('invalid');
				}	
			}
		});
		
		input.addEventListener('focus', function() {
			this.classList.remove('invalid');
			this.classList.remove('valid');
		});
	};

	// Добавил автоматический капиталайз ФИО при вводе
	document.querySelector('.form__full-name').addEventListener('input', function() {
		console.log(this.value)
		this.value = toTitleCase(this.value);
	});

	// Непосредственно функция капиталайза
	function toTitleCase(str) {
        return str.replace(
            /[а-яА-ЯЁё]\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

	// Попробовал сделать прямой запрет на ввод неуместных символов
	// как говорится - реализация подкачала, но в целом работает
	fullName_input.addEventListener('keydown', event => {
		if (!(/[а-яА-яЕё -]+/.test(event.key)) && event.key.length == 1) {
			// Проверка event.key.length == 1 для использования backspace, alt, tap и тп
			// потому что он их тоже блокирует, хотел использовать keypress, но узнал
			// что его не рекомендуют использовать
			event.preventDefault();
		}
	});
	email_input.addEventListener('keydown', event => {
		if (!(/[A-Za-z0-9_.%+-@ ]+/.test(event.key)) && event.key.length == 1) {
			event.preventDefault();
		}
	});


	// Маска для телефона пользователя
	function mask(event) {
		let phonePattern = '+7(___) ___-__-__',
			i = 0,
			defaultValue = phonePattern.replace(/\D/g, ''),
			currentValue = this.value.replace(/\D/g, '');

		// Ставим семерку вначале 
		if (defaultValue.length >= currentValue.length)
			currentValue = defaultValue;

		// Непосредственно замена маски на символы пользователя
		this.value = phonePattern.replace(/./g, function(a) {
			return /[_\d]/.test(a) && i < currentValue.length ? currentValue.charAt(i++) : i >= currentValue.length ? '' : a;
		});

		if (event.type == 'blur') 
		{
			//Убираем часть шаблона (<+7>) когда теряем фокус
			if (this.value.length == 2)
				this.value = '';
		}
		else {
			setCursorPosition(this.value.length, this);
		}
	};
	
	function setCursorPosition(pos, element) {
		element.focus();
		if (element.setSelectionRange) {
			element.setSelectionRange(pos, pos);
		}
		else 
		{
			if (element.createTextRange) {
				let range = element.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		}
	};

});