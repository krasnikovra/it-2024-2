import responseStatus from "./status";

export function register(body) {
    const { login, password, passwordRepeat } = body;

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
    if (passwordRepeat.trim() === '') {
        return {
            status: responseStatus.failed,
            detail: {
                error: error.emptyPwd
            }
        }
    }
    if (login === 'admin') {
        return {
            status: responseStatus.failed,
            detail: {
                error: error.loginAlreadyRegistered
            }
        }
    }

    return {
        status: responseStatus.ok,
        detail: { }
    }
}

export const error = Object.freeze({
    emptyLogin: 'empty_login',
    emptyPwd: 'empty_pwd',
    emptyPwdRepeat: 'empty_pwd_repeat',
    loginAlreadyRegistered: 'login_already_registered'
});
