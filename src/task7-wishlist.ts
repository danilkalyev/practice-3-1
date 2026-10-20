// ============================================================
// Практика 3.2: Вишлист (Избранное) и зависимости
// ============================================================
// Wishlist хранит только id книг. Сами книги живут в BookCatalog
// (единый источник истины), а каталог приходит в getFavorites
// как параметр — это зависимость, а не композиция.
//
// Проверка: npm test -- task7
// ============================================================

import { Book } from "./task1-types";
import { BookCatalog } from "./task6-classes";

export class Wishlist {
  private favoriteIds: string[] = [];

  // ids — сохранённые id из localStorage (по умолчанию вишлист пустой)
  constructor(ids: string[] = []) {
    this.favoriteIds = [...ids];
  }

  // есть id — убираем, нет — добавляем в конец
  toggle(id: string): void {
    if (this.has(id)) {
      this.favoriteIds = this.favoriteIds.filter((favId) => favId !== id);
    } else {
      this.favoriteIds = [...this.favoriteIds, id];
    }
  }

  // true, если книга в избранном
  has(id: string): boolean {
    return this.favoriteIds.includes(id);
  }

  // каталог — зависимость: не хранится в полях, приходит на время вызова.
  // Берём актуальные книги из каталога и оставляем только избранные,
  // поэтому удалённая из каталога книга сама пропадает из избранного
  getFavorites(catalog: BookCatalog): Book[] {
    return catalog.getBooks().filter((book) => this.has(book.id));
  }

  // копия id — для сохранения в localStorage
  getIds(): string[] {
    return [...this.favoriteIds];
  }

  // количество id в избранном
  get count(): number {
    return this.favoriteIds.length;
  }
}
