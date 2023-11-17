function showDocumentation() {
    const documentationText = "В етом дневнике всегда будет появляться дз в режиме реального времени. " +
        "Вы можете добавлять, просматривать Дз. Документация находится в процессе разработки.";
    alert(documentationText);
}



// Функция для добавления записи
function addEntry() {
    var date = document.getElementById('date').value;
    var entryText = document.getElementById('entry').value;

    if (date && entryText) {
        // Создание объекта записи
        var entry = {
            date: date,
            entryText: entryText
        };

        // Получение текущих записей из Local Storage
        var entries = JSON.parse(localStorage.getItem('entries')) || [];

        // Добавление новой записи
        entries.push(entry);

        // Сохранение записей в Local Storage
        localStorage.setItem('entries', JSON.stringify(entries));

        // Обновление списка записей на странице
        displayEntries();

        // Очистка формы
        document.getElementById('diaryForm').reset();
    } else {
        alert('Пожалуйста, заполните все поля.');
    }
}

// Функция для отображения записей на странице
function displayEntries() {
    var entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = ''; // Очистка списка перед обновлением

    var entries = JSON.parse(localStorage.getItem('entries')) || [];

    entries.forEach(function (entry, index) {
        var entryItem = document.createElement('li');
        entryItem.classList.add('entryItem');

        var dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = entry.date;

        var entryTextElement = document.createElement('div');
        entryTextElement.classList.add('entryText');
        entryTextElement.textContent = entry.entryText;

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', function () {
            deleteEntry(index);
        });

        entryItem.appendChild(dateElement);
        entryItem.appendChild(entryTextElement);
        entryItem.appendChild(deleteButton);

        entriesList.appendChild(entryItem);
    });
}

// Функция для удаления записи
function deleteEntry(index) {
    var entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Удаление записи по индексу
    entries.splice(index, 1);

    // Обновление Local Storage
    localStorage.setItem('entries', JSON.stringify(entries));

    // Обновление списка записей на странице
    displayEntries();
}

// Вызов функции для отображения записей при загрузке страницы
displayEntries();
