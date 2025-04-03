export default {
    'task_manager': 'Менеджер задач',
    'login': 'Вход',
    'loading': 'Загрузка',
    'loading_n_seconds_left': n => {
        let secondPostfix = '';
        let leftPostfix = 'ось';
        const nBetween10and20 = n > 10 && n < 20;
        if (n % 10 === 1 && !nBetween10and20) {
            secondPostfix = 'а';
            leftPostfix = 'ась';
        }
        else if ([2, 3, 4].includes(n % 10) && !nBetween10and20) {
            secondPostfix = 'ы';
        }

        return `Загрузка... (Остал${leftPostfix} ${n} секунд${secondPostfix})`;
    },
    'email': 'E-mail',
    'somebody_email': 'somebody@gmail.com',
    'enter_nonempty_login': 'Введите непустой e-mail',
    'enter_nonempty_password': 'Введите непустой пароль',
    'wrong_login_or_pwd': 'Неверный логин или пароль',
    'passwords_are_not_equal': 'Пароли не совпадают',
    'login_already_registered': 'Такой логин уже зарегистрирован',
    'password': 'Пароль',
    'to_login': 'Войти',
    'to_register': 'Зарегистрироваться',
    'no_account_question': 'Нет аккаунта?',
    'to_log_out': 'Выйти',
    'registration': 'Регистрация',
    'repeat_password': 'Повторите пароль',
    'already_have_account_question': 'Уже есть аккаунт?',
    'editing': 'Редактирование',
    'task_name': 'Название задачи',
    'my_task': 'Моя задача',
    'deadline': 'Дедлайн',
    'important_task': 'Важная задача',
    'cancel': 'Отмена',
    'to_save': 'Сохранить',
    'ru': 'Русский',
    'en': 'Английский'
};
