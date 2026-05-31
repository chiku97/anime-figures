import expres from "express";
import cors from "cors";
import dotenv from "dotenv";
import carRoutes from "./routes/routes.js";


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = expres();
app.use(cors());
app.use(expres.json());

app.get("/api/v1/health", (req, res) => {
  res.send("Health is fine!");
});

app.use("/api/v1", carRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});