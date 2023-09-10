import "dotenv/config";
import "./db.js";
import"./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";

import app from "./server";

const PORT =process.env.PORT || 8080;




app.listen(PORT);