const languages: LanguagesType = {
    "Token not provided": {
        "RU": "Токен не предоставлен",
        "UA": "Токен не надано",
        "EN": "Token not provided"
    },
    "user not found": {
        "RU": "Пользователь не найден",
        "UA": "Користувача не знайдено",
        "EN": "User not found"
    },
    "You have reached your 7 day request limit.": {
        "RU": "Вы достигли 7-дневного лимита запросов.",
        "UA": "Ви досягли 7-денного ліміту запитів.",
        "EN": "You have reached your 7 day request limit."
    },
    "Server error checking request limit.": {
        "RU": "Лимит запросов на проверку ошибок сервера.",
        "UA": "Ліміт запитів на перевірку помилок сервера.",
        "EN": "Server error checking request limit."
    },
    "The number is not correct": {
        "RU": "Цифра не корректная",
        "UA": "Цифра не коректна",
        "EN": "The number is not correct"
    },
    "Invalid IP address or domain": {
        "RU": "Некорректный IP адрес или домен",
        "UA": "Некоректна IP-адреса або домен",
        "EN": "Invalid IP address or domain"
    },
    "error: microserver not responding": {
        "RU": "Ошибка: микросервер не отвечает",
        "UA": "Помилка: мікросервер не відповідає",
        "EN": "Error: microserver not responding"
    },
    "Invalid domain": {
        "RU": "Некорректный домен",
        "UA": "Некоректний домен",
        "EN": "Invalid domain"
    },
    "Incorrect data in the request": {
        "RU": "Некорректныe данные в запросе",
        "UA": "Некоректні дані у запиті",
        "EN": "Incorrect data in the request"
    },
    "Incorrect arguments": {
        "RU": "Некорректные аргументы",
        "UA": "Некоректні аргументи",
        "EN": "Incorrect arguments"
    },
    "Arguments must be an array.": {
        "RU": "Аргументы должны быть массивом.",
        "UA": "Аргументи мають бути масивом.",
        "EN": "Arguments must be an array."
    },
    "There are duplicates in your arguments, please remove them.": {
        "RU": "В ваших аргументах обнаружены дубликаты, пожалуйста, удалите их.",
        "UA": "У ваших аргументах виявлені дублікати, будь ласка, видаліть їх.",
        "EN": "There are duplicates in your arguments, please remove them."
    },
    "Incorrect port list": {
        "RU": "Некорректный список портов",
        "UA": "Некоректний список портів",
        "EN": "Incorrect port list"
    },
    "Duplicate ports were found in your ports, please remove them.": {
        "RU": "В ваших портах обнаружены дубликаты, пожалуйста, удалите их.",
        "UA": "У ваших портах виявлені дублікати, будь ласка, видаліть їх.",
        "EN": "Duplicate ports were found in your ports, please remove them."
    },
    "the server is not responding": {
        "RU": "Сервер не отвечает",
        "UA": "Сервер не відповідає",
        "EN": "The server is not responding"
    },
    "The nickname is too small": {
        "RU": "Никнейм слишком маленький",
        "UA": "Нікнейм занадто маленький",
        "EN": "The nickname is too small"
    },
    "Incorrect mail": {
        "RU": "Некорректная почта",
        "UA": "Некоректна пошта",
        "EN": "Incorrect mail"
    },
    "(Minimum 8 characters, at least one number, one uppercase and one lowercase letter)": {
        "RU": "(Минимум 8 символов, как минимум одна цифра, одна заглавная и одна строчная буква)",
        "UA": "(Мінімум 8 символів, як мінімум одна цифра, одна велика і одна мала літера)",
        "EN": "(Minimum 8 characters, at least one number, one uppercase and one lowercase letter)"
    },
    "Error in script. Please make sure everything is entered correctly.": {
        "RU": "Ошибка в скрипте. Пожалуйста, убедитесь, что все введено верно.",
        "UA": "Помилка у скрипті. Будь ласка, переконайтеся, що все введено правильно.",
        "EN": "Error in script. Please make sure everything is entered correctly."
    },
    "Script does not exist. Please enter a valid script.": {
        "RU": "Скрипт не существует. Введите правильный скрипт.",
        "UA": "Скрипт не існує. Введіть правильний скрипт.",
        "EN": "Script does not exist. Please enter a valid script."
    },
    "": {
        "RU": "",
        "UA": "",
        "EN": ""
    }
}

interface LanguagesType {
    [key: string]: {
        [key: string]: string;
    };
}

export default languages
