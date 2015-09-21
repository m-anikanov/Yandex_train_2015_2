/*
	DOMClasses(element), где element - ссылка на DOM элемент,
	возвращает ссылку на объект и устанавливает за ним наблюдение.
	После чего все изменения в этом объекте начинают отражаться в 
	атребуте class данного элемента.

	Объект имеет следующий формат:

	{
		classname1 : true,
		classname2 : true,
		...
	}

	Помимо стандартных операций с объектами он поддерживает следующие операции:

	classObject.classname1 = false; 		  //удалит данное свойство из объекта, а класс из элемента.
	classObject.classname1 = "classname2";    //заменит classname1 на classname2 в объекте и в элементе.

*/


DOMClasses = function(element){
	
	if(typeof element.className !== "string"){
		return false;
	}

	//получаем ссылку на объект за которым наблюдаем, или создаем новый
	var classObject = element.DOMClassesObj ? element.DOMClassesObj : {};

	var observer = element.DOMClassesObserver;
	var currentClasses = element.className.split(" ");

	if(observer) Object.unobserve(classObject, observer);
	else{
		observer = function(change){

			/*
			Без разницы, из какого по счету события брать текущее состояние объекта,
			т.к. к этому моменту выполнятся все события из цепочки,
			а ссылка все равно будет указывать на объект в его финальном состоянии.
			*/

			var classObject = change[0].object;
			var currentClasses = element.className.split(" ");

			//Снимаем наблюдение за объектом, чтоб вносить в него изменения.
			Object.unobserve(classObject, observer);

			//Дополнительный функционал для работы с данным объектом. 
			for(var i in classObject){

				//За одно, валидация значений.
				if(typeof classObject[i] !== "string" && typeof classObject[i] !== "boolean"){
					console.error("DOMClasses: assigned incorrect value");
					delete classObject[i];
				}

				if(!classObject[i]) delete classObject[i];//присвоить false, чтоб убрать класс
				else if(i != classObject[i] && classObject[i] != true){ //присвоить другой класс, чтоб заменить
					//debugger;
					
					classObject[classObject[i]] = true;
					delete classObject[i];
					
				}
				
			}

			//Продолжаем наблюдать.
			Object.observe(classObject, observer);

			element.className = Object.keys(classObject).join(" ");
		};

		//сохраняем наблюдателя в элементе.
		element.DOMClassesObserver = observer;
	}
	//сохраняем ссылку на объект в элементе.
	element.DOMClassesObj = classObject;

	//удаляем то, чего нет в DOM
	Object.keys(classObject).forEach(function(value, className){
		if(!~currentClasses.indexOf(className)) delete classObject[className];
	});

	//добавляем то, чего нет объекте
	currentClasses.forEach(function(className){
		if(className)classObject[className] = true;
		
	});


	Object.observe(classObject, observer);

	return classObject;
}
