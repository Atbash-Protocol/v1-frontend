import { resources } from './i18n';
import 'react-i18next';

declare module 'react-i18next' {
    type DefaultResources = typeof resources['en'];
    interface Resources extends DefaultResources {}
}
