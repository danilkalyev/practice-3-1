// ============================================================
// Практика 3: Классы и ООП
// ============================================================
// Цель: заменить функциональный каталог из Практик 2.1–2.2
// на класс с состоянием.
//
// Проверка: npm test -- task6
// ============================================================

import { Book, formatBook } from "./task1-types";
import { createBookFromForm } from "./task4-integration";
import { filterByTitle, sortBooks } from "./task5-utils";

/*
  Реализуйте класс BookCatalog.

  Состояние:
    - books: Book[]        — приватное, снаружи недоступно
    - id: string           — readonly

  Конструктор: (id: string, books: Book[] = [])

  Публичный API:
    addBook(book: Book): void
    removeBook(id: string): void
    getBooks(): Book[]
    searchByTitle(query: string): Book[]
    sortBy(sortType: 'year' | 'rating'): Book[]
    get count(): number

  Требования:
    - addBook / removeBook не мутируют массив, а создают новый
    - searchByTitle и sortBy переиспользуют filterByTitle / sortBooks
    - внешний код не может присвоить this.books напрямую

  Бонус: класс Book с полями id, title, authors, year?, rating?,
  методом format() и статическим createFromFormData(FormData).
*/

export class BookCatalog {
  private books: Book[];
  readonly id: string;

  constructor(id: string, books: Book[] = []){
    this.id = id;
    this.books = books;
  }

  addBook(book: Book): void {
    this.books = [...this.books, book];
  }

  removeBook(id: string) {
    this.books = [...this.books].filter(b => b.id !== id);
  }

  getBooks(): Book[] {
    return [...this.books]
  }

  sortBy(sortType: "year" | "rating"): Book[] {
    return sortBooks(this.books, sortType);
  }

  searchByTitle(query: string): Book[] {
    return this.books.filter(filterByTitle(query));
  }

  get count(): number {
    return this.books.length;
  }
}

// Бонус: класс одной книги (имя BookClass — чтобы не конфликтовать с интерфейсом Book)
export class BookClass {
  readonly id: string;
  title: string;
  authors: string[];
  year?: number;
  rating?: number;

  constructor(id: string, title: string, authors: string[], year?: number, rating?: number) {
    this.id = id;
    this.title = title;
    this.authors = authors;
    this.year = year;
    this.rating = rating;
  }

  // логика из formatBook: "Title (Year) — Authors"
  format(): string {
    return formatBook(this);
  }

  // static — вызывается у самого класса: BookClass.createFromFormData(formData)
  static createFromFormData(formData: FormData): BookClass {
    const book = createBookFromForm(formData);
    return new BookClass(book.id, book.title, book.authors, book.year, book.rating);
  }
}
