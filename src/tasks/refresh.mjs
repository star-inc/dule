import {loadDatabase} from "../init/phishingtank.mjs";
export default () => Promise.all([
    loadDatabase,
]);
