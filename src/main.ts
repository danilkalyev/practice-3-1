import './styles.css';
import { Book } from './task1-types';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { sortBooks } from './task5-utils';
//TODO 3.0: импортируйте BookCatalog из task6
import { BookCatalog, BookClass } from './task6-classes';

// TODO 3.1: каталог — экземпляр класса BookCatalog.
// Порядок аргументов: сначала id, потом книги.
let catalog = new BookCatalog('main', [
  { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2024 },
  { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 },
]);


// восстановление из localStorage

// TODO 3.2: JSON.parse вернёт объект БЕЗ методов,
// поэтому заново создаём экземпляр класса из сохранённых данных.
// Старый формат из Практики 2 ({ '1': {...} }) не имеет поля books — его пропускаем.
const saved = localStorage.getItem('catalog');
if (saved) {
  const parsed = JSON.parse(saved);
  if (Array.isArray(parsed.books)) {
    catalog = new BookCatalog(parsed.id, parsed.books);
  }
}


// сохранение В localStorage
// JSON.stringify(catalog) даст строку вида {"id":"main","books":[...]}
function saveCatalog() {
  localStorage.setItem('catalog', JSON.stringify(catalog));
}

// DOM-элементы
const bookList = document.querySelector('#bookList') as HTMLDivElement;
const form = document.querySelector('#bookForm') as HTMLFormElement;
const filterBtn = document.querySelector('#applyFilters') as HTMLButtonElement;
const authorInput = document.querySelector('#filterAuthor') as HTMLInputElement;
const yearInput = document.querySelector('#filterYear') as HTMLInputElement;
const errorMessage = document.querySelector('#errorMessage') as HTMLDivElement;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const sortBySelect = document.querySelector('#sortBy') as HTMLSelectElement;

// отрисовка
function renderBooks(books: Book[]) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.textContent = 'Книги не найдены. Попробуйте изменить фильтры.';
    return;
  }

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';

    const titleEl = document.createElement('h3');
    titleEl.textContent = `${book.title} — ${book.authors.join(', ')}${book.year ? `, ${book.year}` : ''}`;
    card.append(titleEl);

    if (book.rating !== undefined) {
      const ratingEl = document.createElement('p');
      ratingEl.textContent = `Рейтинг: ${book.rating}`;
      card.append(ratingEl);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => {

      // TODO 3.3: удаление — метод класса
      catalog.removeBook(book.id);
      saveCatalog();
      // TODO 3.4: Object.values(catalog) -> catalog.getBooks()
      renderBooks(catalog.getBooks());
    });
    card.append(deleteBtn);

    bookList.append(card);
  });
}

// Первичная отрисовка (сортировка — метод класса)
renderBooks(catalog.sortBy(sortBySelect.value as 'year' | 'rating'));

// обработчик формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  try {
    const formData = new FormData(form);
    // бонус: книга создаётся статическим методом класса BookClass
    const newBook = BookClass.createFromFormData(formData);

    // TODO 3.5: добавление — метод класса
    catalog.addBook(newBook);

    saveCatalog();
    form.reset();

    renderBooks(catalog.getBooks());
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.textContent = error.message;
    }
  }
});

// фильтры, поиск и сортировка
function refreshList() {
  const filters: ((book: Book) => boolean)[] = [];

  if (authorInput.value.trim()) filters.push(filterByAuthor(authorInput.value.trim()));
  if (yearInput.value) filters.push(filterByMinYear(parseInt(yearInput.value, 10)));

  // поиск по названию — метод класса (пустая строка вернёт все книги)
  const foundBooks = catalog.searchByTitle(searchInput.value.trim());

  // фильтры по автору и году — к найденным книгам
  const filteredBooks = applyFilters(foundBooks, filters);

  // сортируем только найденные книги
  // (catalog.sortBy() отсортировал бы весь каталог, поэтому здесь sortBooks — её же использует sortBy внутри)
  renderBooks(sortBooks(filteredBooks, sortBySelect.value as 'year' | 'rating'));
}

filterBtn.addEventListener('click', refreshList);
searchInput.addEventListener('input', refreshList);
sortBySelect.addEventListener('change', refreshList);
