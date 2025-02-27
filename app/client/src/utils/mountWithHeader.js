import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Header from '../widget/header';

export default function mountWithHeader(root, elem) {
    mount(
        root,
        <div className='app-body'>
            <Header />
            <div className='container centered'>
                {elem}
            </div>
        </div>
    );
}
