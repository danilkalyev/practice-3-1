# Аудит неиспользуемых функций

Найдены функции в `src/`, которые экспортируются, но не используются в `main.ts`
(после перехода на класс `BookCatalog`).

| Название функции | Где находится | Полезная ли она? (Да/Нет) | Как её можно использовать в будущем? (Идея для фичи) |
| :--- | :--- | :--- | :--- |
| calculateAverageYear | task1-types.ts | Да | Показать в шапке сайта: «Средний год книг в коллекции: 2021» |
| formatBook | task1-types.ts | Да | Уже используется в `BookClass.format()`; в будущем — кнопка «Скопировать список книг» |
| filterByMinRating | task3-filters.ts | Да | Добавить в фильтры поле «Минимальный рейтинг» |
| addBook | task2-functions.ts | Нет | Дублирует метод `BookCatalog.addBook` — удалена |
| removeBook | task2-functions.ts | Нет | Дублирует метод `BookCatalog.removeBook` — удалена |
| getBook | task2-functions.ts | Нет | Работает со старым типом `Catalog` (словарь), который больше не используется — удалена |
| filterAndSortBooks | task5-utils.ts | Нет | Дублирует `searchByTitle` + `sortBy` класса `BookCatalog` — удалена |

## Решение

- **Полезные** функции оставлены и помечены JSDoc-комментарием `@deprecated`:
  `calculateAverageYear` (задел на фичу «Статистика»), `filterByMinRating` (задел на фичу «Фильтр по рейтингу»).
  `formatBook` не помечена, так как теперь используется в бонусном классе `BookClass`.
- **Бесполезные** функции удалены вместе с тестами:
  - `src/task2-functions.ts` (`addBook`, `removeBook`, `getBook`) и `tests/task2.test.ts`;
  - `filterAndSortBooks` из `src/task5-utils.ts` и `tests/task5.test.ts`
    (те же проверки поиска и сортировки есть в `tests/task6.test.ts`).
- Удалён тип `Catalog` из `task1-types.ts` — после перехода на класс он нигде не используется.
