# Mecenate Mobile

Это мобильное приложение на Expo и React Native. В нем есть лента публикаций, экран отдельного поста, лайки, комментарии и realtime-обновления.

**Что уже сделано**

- Приложение сразу открывает ленту публикаций без лишнего стартового экрана.
- Есть экран отдельной публикации с комментариями.
- Лайки работают сразу в интерфейсе без ожидания ответа сервера, потом состояние синхронизируется через React Query.
- Комментарии и лайки обновляются в realtime через WebSocket.
- Поле отправки комментария сделано в более мобильном формате: кнопка отправки находится внутри инпута.
- Интерфейс упрощен под ваш макет: белый фон, карточки на всю ширину, состояния кнопок, отдельный экран ошибки загрузки публикации.

**На чем сделан проект**

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- React Query
- MobX
- Axios

**Как запустить проект**

Сначала установите зависимости:

```bash
npm install
```

Потом создайте файл .env в корне проекта и добавьте туда:

```env
EXPO_PUBLIC_API_URL=https://k8s.mectest.ru/test-app
EXPO_PUBLIC_WS_URL=wss://k8s.mectest.ru/test-app/ws
```

Если файл .env не создать, проект все равно будет работать, потому что в коде уже есть адреса по умолчанию.

Дальше можно запускать приложение:

```bash
npm start
```

Android:

```bash
npm run android
```

iOS:

```bash
npm run ios
```

Web:

```bash
npm run web
```

Проверка типов:

```bash
npm run typecheck
```

**Какие переменные окружения используются**

В проекте используются две публичные переменные Expo:

- EXPO_PUBLIC_API_URL - адрес HTTP API
- EXPO_PUBLIC_WS_URL - адрес WebSocket для realtime

Если их не указать, будут использованы стандартные значения:

- API: https://k8s.mectest.ru/test-app
- WebSocket: wss://k8s.mectest.ru/test-app/ws

Где это используется:

- [src/api/client.ts](src/api/client.ts) - HTTP клиент
- [src/realtime/socket.ts](src/realtime/socket.ts) - WebSocket подключение
- [src/types/env.d.ts](src/types/env.d.ts) - типы env-переменных

**Что важно про Expo Go**

Проект работает на Expo SDK 54. Для разработки лучше использовать Node.js 20 LTS.

Если хотите открыть проект через Expo Go, на телефоне должна быть установлена версия Expo Go, совместимая с SDK 54. Важно понимать, что Expo Go поддерживает только одну актуальную версию SDK за раз. Если версия на телефоне не совпадает с версией проекта, приложение может не запуститься.

Если Expo Go не открывает проект, используйте эмулятор Android, симулятор iOS или development build.

Как быстро запустить через Expo Go:

1. Выполните npm start.
2. Откройте Expo Go на телефоне.
3. Отсканируйте QR-код из терминала или браузера.

**Как устроен проект**

- [app/index.tsx](app/index.tsx) - редирект на ленту
- [app/feed/index.tsx](app/feed/index.tsx) - экран ленты публикаций
- [app/post/[id].tsx](app/post/%5Bid%5D.tsx) - экран отдельной публикации
- [src/components/post](src/components/post) - карточка поста, лайк и UI публикаций
- [src/components/comments](src/components/comments) - список комментариев и composer
- [src/hooks/useTogglePostLike.ts](src/hooks/useTogglePostLike.ts) - общая логика лайков

**Дополнительно**

- Идентификатор пользователя генерируется локально на устройстве и хранится в secure storage.
- Серверные данные лежат в React Query, локальное UI-состояние хранится в MobX.
- При открытии приложения первым экраном сразу загружается лента карточек публикаций.
