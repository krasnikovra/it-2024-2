import babel from '@rollup/plugin-babel';
const pages = ['login.js', 'register.js', 'edit.js'];

const pluginList = [babel({ babelHelpers: 'bundled' })];
const export_page = pages.reduce((acc, item) => {
    acc.push({
        input: `./src/${item}`,
        output: {
            file: `../server/www/js/${item}`,
            format: 'cjs',
            sourcemap: 'inline',
        },
        plugins: pluginList,
    });
    return acc;
}, []);

export default export_page;
