# GreenGlobe - Ekoloji Mühafizə Platforması

Azərbaycanın təbii irsinin qorunmasına yönəlmiş ekoloji mühafizə platforması.

## İcmal

GreenGlobe vətəndaşlara ekoloji müsabiqələrdə iştirak etmək, eko-tədbirlərə qoşulmaq, ekoloji problemləri bildirmək və Azərbaycanın müxtəlif ekosistemləri - Xəzər dənizi, Qafqaz dağları və qorunan milli parklar haqqında öyrənmək imkanı verir.

## Xüsusiyyətlər

### Ekoloji Müsabiqələr
- Vəhşi Təbiətin Qorunması, Su Qənaəti, Davamlı Yaşayış, Bərpa Olunan Enerji, Azərbaycan Biomüxtəlifliyi, Xəzər Dənizinin Qorunması, İqlim Dəyişikliyi və Meşə Qorunması mövzularını əhatə edən **8 İnteraktiv Viktorina**
- Azərbaycan, İngilis və Rus dillərində **55+ Çoxdilli Sual**
- Xal izləmə və lider lövhələri

### Eko-Tədbirlər
- Ekoloji tədbirlərə (təmizlik, ağac əkimi, vəhşi təbiətin qorunması) baxış və qeydiyyat
- Qeydiyyat/qeydiyyatdan çıxma funksiyası ilə tam RSVP sistemi
- Tədbir kateqoriyaları və məkan məlumatları
- Keçmiş tədbirlər arxivi

### İcma İştirakı
- **İcma Yazıları** - Müzakirələr, tədbir rəyləri və arzular paylaşın
- **Problem Bildirişi** - Ekoloji problemləri səlahiyyətlilərə bildirin
- Bəyənmə və şərh funksiyası
- Fəaliyyət izləmə ilə istifadəçi profilləri

### İnteraktiv Xəzər Dənizi Bölməsi
- Dəniz faktları ilə animasiyalı çevirmə kartları
- Ekoloji problemlər və həllər
- Davamlı inkişaf məlumatları

### İstifadəçi Paneli
- Şəxsi müsabiqə xalları
- Tədbir qeydiyyatı tarixçəsi
- Nailiyyət izləmə

## Texnologiya Yığını

### Frontend
| Texnologiya | Məqsəd |
|-------------|--------|
| React 18 | UI komponent kitabxanası |
| TypeScript | Tip-təhlükəsiz inkişaf |
| Vite | Qurma aləti və dev server |
| Wouter | Müştəri tərəfi marşrutlaşdırma |
| TanStack Query | Server vəziyyəti idarəetməsi |
| Tailwind CSS | Utilit-əvvəl stilizasiya |
| Shadcn/ui | Komponent kitabxanası |
| Radix UI | Əlçatan UI primitivləri |
| Framer Motion | Animasiyalar |
| Lucide React | İkonlar |

### Backend
| Texnologiya | Məqsəd |
|-------------|--------|
| Node.js | Runtime mühiti |
| Express.js | Veb server framework |
| Passport.js | Autentifikasiya |
| OpenID Connect | Replit Auth inteqrasiyası |

### Verilənlər Bazası
| Texnologiya | Məqsəd |
|-------------|--------|
| PostgreSQL | Relational verilənlər bazası (Neon) |
| Drizzle ORM | Tip-təhlükəsiz sorğular |
| Zod | Schema validasiyası |

## Beynəlxalqlaşdırma

Platforma üç dili dəstəkləyir:
- **İngilis (en)** - Defolt
- **Azərbaycan (az)** - Ana dil
- **Rus (ru)** - Regional dil

Dil naviqasiya panelindəki dünya ikonası vasitəsilə dəyişdirilə bilər.

## Mövzu

- **İşıq Rejimi** - Yaşıl aksentlərlə təmiz ağ fon
- **Qaranlıq Rejim** - Açıq mətn ilə tünd yaşılımtıl-qara fon

Mövzu keçidi naviqasiya panelində mövcuddur.

## Layihə Strukturu

```
├── client/                 # Frontend tətbiqi
│   ├── src/
│   │   ├── components/     # Təkrar istifadə edilə bilən UI komponentləri
│   │   ├── hooks/          # Xüsusi React hooks
│   │   ├── lib/            # Utilitlər (i18n, theme, query client)
│   │   └── pages/          # Səhifə komponentləri
├── server/                 # Backend tətbiqi
│   ├── routes.ts           # API endpointləri
│   ├── storage.ts          # Məlumat giriş qatı
│   └── auth.ts             # Autentifikasiya quraşdırması
├── shared/                 # Paylaşılan kod
│   └── schema.ts           # Verilənlər bazası sxemi və tipləri
└── migrations/             # Verilənlər bazası miqrasiyaları
```

## Lisenziya

MIT Lisenziyası

---

# GreenGlobe - Платформа Экологической Защиты

Платформа экологической защиты, направленная на сохранение природного наследия Азербайджана.

## Обзор

GreenGlobe позволяет гражданам участвовать в экологических конкурсах, присоединяться к эко-мероприятиям, сообщать об экологических проблемах и узнавать о разнообразных экосистемах Азербайджана - Каспийском море, Кавказских горах и охраняемых национальных парках.

## Функции

### Экологические Конкурсы
- **8 Интерактивных Викторин** по темам: Охрана Дикой Природы, Сохранение Воды, Устойчивый Образ Жизни, Возобновляемая Энергия, Биоразнообразие Азербайджана, Охрана Каспийского Моря, Изменение Климата и Охрана Лесов
- **55+ Многоязычных Вопросов** на азербайджанском, английском и русском языках
- Отслеживание очков и таблицы лидеров

### Эко-Мероприятия
- Просмотр и регистрация на экологические мероприятия (уборка, посадка деревьев, охрана дикой природы)
- Полная система RSVP с функцией регистрации/отмены регистрации
- Категории мероприятий и информация о местоположении
- Архив прошедших мероприятий

### Участие Сообщества
- **Публикации Сообщества** - Делитесь обсуждениями, отзывами о мероприятиях и пожеланиями
- **Сообщение о Проблемах** - Сообщайте об экологических проблемах властям
- Функция лайков и комментариев
- Профили пользователей с отслеживанием активности

### Интерактивный Раздел Каспийского Моря
- Анимированные карточки с фактами о море
- Экологические проблемы и решения
- Информация об устойчивом развитии

### Панель Пользователя
- Личные результаты конкурсов
- История регистрации на мероприятия
- Отслеживание достижений

## Технологический Стек

### Фронтенд
| Технология | Назначение |
|------------|------------|
| React 18 | Библиотека UI компонентов |
| TypeScript | Типобезопасная разработка |
| Vite | Инструмент сборки и dev сервер |
| Wouter | Клиентская маршрутизация |
| TanStack Query | Управление состоянием сервера |
| Tailwind CSS | Utility-first стилизация |
| Shadcn/ui | Библиотека компонентов |
| Radix UI | Доступные UI примитивы |
| Framer Motion | Анимации |
| Lucide React | Иконки |

### Бэкенд
| Технология | Назначение |
|------------|------------|
| Node.js | Среда выполнения |
| Express.js | Веб-фреймворк |
| Passport.js | Аутентификация |
| OpenID Connect | Интеграция Replit Auth |

### База Данных
| Технология | Назначение |
|------------|------------|
| PostgreSQL | Реляционная база данных (Neon) |
| Drizzle ORM | Типобезопасные запросы |
| Zod | Валидация схемы |

## Интернационализация

Платформа поддерживает три языка:
- **Английский (en)** - По умолчанию
- **Азербайджанский (az)** - Родной язык
- **Русский (ru)** - Региональный язык

Язык можно переключить с помощью иконки глобуса в панели навигации.

## Темы Оформления

- **Светлый Режим** - Чистый белый фон с зелёными акцентами
- **Тёмный Режим** - Тёмный зеленовато-чёрный фон со светлым текстом

Переключатель темы доступен в панели навигации.

## Структура Проекта

```
├── client/                 # Фронтенд приложение
│   ├── src/
│   │   ├── components/     # Переиспользуемые UI компоненты
│   │   ├── hooks/          # Пользовательские React хуки
│   │   ├── lib/            # Утилиты (i18n, theme, query client)
│   │   └── pages/          # Компоненты страниц
├── server/                 # Бэкенд приложение
│   ├── routes.ts           # API эндпоинты
│   ├── storage.ts          # Слой доступа к данным
│   └── auth.ts             # Настройка аутентификации
├── shared/                 # Общий код
│   └── schema.ts           # Схема базы данных и типы
└── migrations/             # Миграции базы данных
```

## Лицензия

Лицензия MIT

---

# GreenGlobe - Environmental Protection Platform

An environmental protection platform focused on preserving Azerbaijan's natural heritage through community engagement, education, and action.

## Overview

GreenGlobe enables citizens to participate in environmental competitions, join eco-events, report environmental problems, and learn about Azerbaijan's diverse ecosystems including the Caspian Sea, Caucasus Mountains, and protected national parks.

## Features

### Environmental Competitions
- **8 Interactive Quizzes** covering topics like Wildlife Protection, Water Conservation, Sustainable Living, Renewable Energy, Azerbaijan Biodiversity, Caspian Sea Conservation, Climate Change, and Forest Conservation
- **55+ Multilingual Questions** available in Azerbaijani, English, and Russian
- Score tracking and leaderboards

### Eco-Events
- Browse and register for environmental events (cleanups, tree planting, wildlife conservation)
- Full RSVP system with register/unregister functionality
- Event categories and location information
- Past events archive

### Community Engagement
- **Community Posts** - Share discussions, event reviews, and wishes
- **Problem Reporting** - Report environmental issues to authorities
- Like and comment functionality
- User profiles with activity tracking

### Interactive Caspian Sea Section
- Animated flip cards with sea facts
- Environmental challenges and solutions
- Sustainable development information

### User Dashboard
- Personal competition scores
- Event registration history
- Achievement tracking

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component library |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| Wouter | Client-side routing |
| TanStack Query | Server state management |
| Tailwind CSS | Utility-first styling |
| Shadcn/ui | Component library |
| Radix UI | Accessible UI primitives |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web server framework |
| Passport.js | Authentication |
| OpenID Connect | Replit Auth integration |

### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database (Neon) |
| Drizzle ORM | Type-safe queries |
| Zod | Schema validation |

## Internationalization

The platform supports three languages:
- **English (en)** - Default
- **Azerbaijani (az)** - Native language
- **Russian (ru)** - Regional language

Language can be switched via the globe icon in the navigation bar.

## Theming

- **Light Mode** - Clean white background with green accents
- **Dark Mode** - Dark greenish-black background with light text

Theme toggle available in the navigation bar.

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities (i18n, theme, query client)
│   │   └── pages/          # Page components
├── server/                 # Backend application
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data access layer
│   └── auth.ts             # Authentication setup
├── shared/                 # Shared code
│   └── schema.ts           # Database schema & types
└── migrations/             # Database migrations
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Session encryption key

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema to database |

## API Endpoints

### Authentication
- `GET /api/login` - Initiate login
- `GET /api/logout` - Logout user
- `GET /api/user` - Get current user

### Events
- `GET /api/events` - List all events
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Unregister from event

### Competitions
- `GET /api/competitions` - List competitions
- `GET /api/competitions/:id/questions` - Get quiz questions
- `POST /api/scores` - Submit quiz score

### Community
- `GET /api/community-posts` - List posts
- `POST /api/community-posts` - Create post
- `POST /api/community-posts/:id/like` - Like post
- `POST /api/community-posts/:id/comments` - Add comment

## Design Features

- **Vibrant Gradients** - Multi-color gradient designs throughout
- **Interactive Animations** - Hover effects, scale transitions, shimmer effects
- **Responsive Layout** - Mobile-first design with adaptive layouts
- **Accessible Components** - Built on Radix UI primitives

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License

---

Azərbaycanın ətraf mühitinə sevgi ilə quruldu 🌿

Создано с любовью к окружающей среде Азербайджана 🌿

Built with love for Azerbaijan's environment 🌿
