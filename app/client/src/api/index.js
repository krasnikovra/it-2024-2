import responseStatus from './status';
import error from './error';
import { login } from './login';

const defaultPendingMs = 1000;

function fake_pending(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function fake_fetch(url, body, desiredResponse) {
    await fake_pending(defaultPendingMs);
    if (desiredResponse) {
        return desiredResponse;
    }

    switch(url) {
        case '/api/v1/login':
            return login(body);
        default:
            return {
                status: responseStatus.failed,
                detail: {
                    error: error.notFound
                }
            }
    }
}
