// Import modules
import {
    StatusCodes,
} from "http-status-codes";

import {
    useApp,
} from "../init/express.mjs";

import {
    phishingArchived,
} from "../init/phishingtank.mjs";

// Export routes mapper (function)
export default () => {
    // Use application
    const app = useApp();

    // API Index Message
    app.get("/", (_, res) => {
        const meetMessage = `
        Star Inc. dule Framework <br />
        <a href="https://github.com/star-inc/dule" target="_blank">
            https://github.com/star-inc/dule
        </a>
        `;
        res.status(StatusCodes.IM_A_TEAPOT).send(meetMessage);
    });

    // The handler for robots.txt (deny all friendly robots)
    app.get("/robots.txt", (_, res) => {
        res.type("txt").send("User-agent: *\nDisallow: /");
    });

    app.get("/archived", (_, res) => {
        res.writeHead(200, {
            "Content-Type": "application/json+gzip",
            "Content-Length": phishingArchived.length,
            "Content-Disposition": "attachment;filename=vaild.json.gz",
        });
        res.end(phishingArchived, "binary");
    });
};
