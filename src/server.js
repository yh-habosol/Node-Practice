import express from "express";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";



const app = express();


app.set('view engine', 'pug');
app.set("views", process.cwd() + "/src/views");


// app.use((req, res, next) => {
// res.setHeader("Access-Control-Allow-Origin", "*");
// res.header(
// "Access-Control-Allow-Headers",
// "Origin, X-Requested-With, Content-Type, Accept"
// );
// next();
// });


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);

app.use(localMiddleware);


app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));


app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);


export default app;