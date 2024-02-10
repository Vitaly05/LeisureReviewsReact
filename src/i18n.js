import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "Sign in 2": "Sign in",
            "Like button": "Like",
            "Rate author": "Rate",
        }
    },
    ru: {
        translation: {
            "Tags Cloud": "Облако Тегов",
            "Profile": "Профиль",
            "Create review": "Создать обзор",
            "Sign Out": "Выйти",
            "Sign In": "Войти",
            "Sign Up": "Регистрация",
            "Search": "Поиск",
            "Remember me": "Запомнить меня",
            "Already have an account?": "Уже есть аккаунт?",
            "Username": "Имя пользователя",
            "Password": "Пароль",
            "Confirm password": "Подтвердите пароль",
            "Please enter username": "Пожалуйста, введите имя пользователя",
            "Please enter password": "Пожалуйста, введите пароль",
            "Please confirm password": "Пожалуйста, подтвердите пароль",
            "Passwords don't match": "Пароли не совпадают",
            "Username is already taken": "Имя пользователя занято",
            "Incorrect username or password": "Неверное имя пользователя или пароль",
            "Account has been blocked": "Аккаунт заблокирован",
            "Don't have an account?": "Нет аккаунта?",
            "Movie": "Кино",
            "Serial": "Сериал",
            "Book": "Книга",
            "Game": "Игра",
            "Music": "Музыка",
            "Place": "Место",
            "Sport": "Спорт",
            "Other": "Другое",
            "Leisure": "Произведение",
            "Review author": "Автор обзора",
            "Like button": "Поставить лайк",
            "See also": "Смотрите также",
            "Comments": "Комментарии",
            "Write your comment": "Ваш комментарий",
            "Send": "Отправить",
            "Sign in 2": "Войдите",
            "to write a comment": "чтобы написать комментарий",
            "There are no comments": "Комментариев нет",
            "You have successfully liked the review!": "Лайк был поставлен!",
            "Reviews": "Обзоры",
            "Date": "Дата",
            "Rate": "Рейтинг",
            "Likes": "Лайки",
            "Latest Reviews": "Последние обзоры",
            "Top-Rated Reviews": "Лучшие обзоры",
            "Main Info": "Основная информация",
            "Content": "Контент",
            "Title": "Название",
            "Tags": "Теги",
            "Group": "Группа",
            "Rate author": "Оценка",
            "Save": "Сохранить",
            "Validation error": "Ошибка валидации",
            "The review has been successfully saved!": "Обзор был успешно сохранён!",
            "Go to home": "На главную",
            "Continue editing": "Продолжить редактирование",
            "Failed to save the review": "Не удалось сохранить обзор",
            "Please enter title": "Пожалуйста, введите название",
            "Max title length is 255": "Максимальная длинна названия - 255 символов",
            "Please enter leisure": "Пожалуйста, введите название произведения",
            "Please select group": "Пожалуйста, выберите группу",
            "Please enter your rate": "Пожалуйста, введите вашу оценку",
            "Please enter content": "Пожалуйста, введите текст обзора",
            "Min rate is 0": "Минимальная оценка - 0",
            "Max rate is 10": "Максимальная оценка - 10",
            "Access denied": "Отказано в доступе",
            "Status": "Статус",
            "Admin": "Админ",
            "Options": "Опции",
            "Block": "Заблокировать",
            "Unblock": "Разблокировать",
            "Make admin": "Сделать админом",
            "Delete": "Удалить",
            "Active": "Активен",
            "Blocked": "Заблокирован",
            "Deleted": "Удалён",
            "There are no reviews": "Обзоров нет",
            "Are you sure you want to delete the review?": "Вы уверены, что хотите удалить обзор?",
            "Cancel": "Отмена",
            "Ok": "Да",
            "Failed to delete the review": "Не удалось удалить обзор",
            "Edit": "Редактировать",
            "Read": "Читать",
            "Sign in to rate leisure!": "Войдите, чтобы оценить!",
            "Or": "Или",
            "Resource not found": "Ресурс не найден"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: window.localStorage.getItem("lang") ?? "en",

        interpolation: {
        escapeValue: false
        }
});

export default i18n;