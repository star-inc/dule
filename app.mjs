// Auto-load config
import "./src/init/config.mjs";

// Import modules
import {
    APP_NAME as appName,
} from "./src/init/const.mjs";
import {
    loadDatabase,
} from "./src/init/phishingtank.mjs";
import {
    getOverview,
} from "./src/config.mjs";
import {
    invokeApp,
} from "./src/execute.mjs";

// Define plugin promises
const pluginPromises = [
    loadDatabase(),
];

// Define schedule tasks
const scheduleTasks = [{
    name: "refresh",
    options: {
        time: "0 6 * * *",
    },
}];

// Define router names
const routerNames = [
    "root",
];

// Define display
const displayStatus = (protocolStatus) => {
    const viewIt = ({protocol, hostname, port}) => {
        const {node, runtime} = getOverview();
        console.info(appName, `(environment: ${node}, ${runtime})`);
        console.info("====");
        console.info(`Protocol "${protocol}" is listening at`);
        console.info(`${protocol}://${hostname}:${port}`);
    };
    protocolStatus.forEach(viewIt);
};

// Mount application and execute it
invokeApp().
    loadPromises(pluginPromises).
    loadTasks(scheduleTasks).
    loadRoutes(routerNames).
    execute().
    then(displayStatus);
