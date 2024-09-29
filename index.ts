import express from 'express';
import bodyParser from 'body-parser';
import roomServiceRoutes from "./routes/routes"

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use("/api", roomServiceRoutes);

app.get("/", (req,res) => {
    res.json({
        message : "Hello from Bun and express"
    })
})

const PORT = 5000;

app.listen(PORT , () => {
    console.log(`Backend is running on PORT: ${PORT}`);
})
