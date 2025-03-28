import responseStatus from "./status";

export function login(body) {
    const { login, password } = body;

    if (login.trim() === '') {
        return {
            status: responseStatus.failed,
            detail: {
                error: error.emptyLogin
            }
        }
    }
    if (password.trim() === '') {
        return {
            status: responseStatus.failed,
            detail: {
                error: error.emptyPwd
            }
        }
    }
    if (login !== 'admin' || password !== 'admin') {
        return {
            status: responseStatus.failed,
            detail: {
                error: error.wrongLoginOrPwd
            }
        }
    }

    return {
        status: responseStatus.ok,
        detail: {
            token: 'abcde',
        }
    }
}

export const error = Object.freeze({
    wrongLoginOrPwd: 'wrong_login_or_pwd',
    emptyLogin: 'empty_login',
    emptyPwd: 'empty_pwd',
});
