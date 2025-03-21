import RU from './t9n.ru';
import EN from './t9n.en';

function useTag(htmlEl, tag) {
    let result = document.createElement(tag);
    if (typeof htmlEl === 'string') {
        result.innerHTML = htmlEl;
    } else {
        result.appendChild(htmlEl);
    }
    return result;
}

function useTags(htmlEl, tags) {
    let result = htmlEl;
    tags.forEach(tag => result = useTag(result, tag));
    return result;
}

export default (landId, code, tag, ...args) => {
    if (code == null || code.length === 0) return '';

    if (!['ru', 'en'].includes(landId)) {
        landId = 'ru';
    }

    let result = code;

    if (landId === 'ru' && RU[code]) {
        result = RU[code];
    }
    if (landId === 'en' && EN[code]) {
        result = EN[code];
    }

    if (typeof result === 'function') {
        result = result(...args);
    }

    if (tag) {
        if (tag instanceof Array) {
            result = useTags(result, tag);
        } else {
            result = useTag(result, tag);
        }
    }

    return result;
}
