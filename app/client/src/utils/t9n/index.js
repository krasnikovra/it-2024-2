import RU from './t9n.ru';
import EN from './t9n.en';

export default (landId, code) => {
    if (code == null || code.length === 0) return '';

    if (!['ru', 'en'].includes(landId)) {
        landId = 'ru';
    }

    if (landId === 'ru' && RU[code]) return RU[code];
    if (landId === 'en' && EN[code]) return EN[code];

    return code;
}
