export default {
    'task_manager': 'Менеджер задач',
    'login': 'Вход',
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
