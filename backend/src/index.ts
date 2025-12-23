import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import themeRoutes from "./routes/themeRoutes";
import itineraryRoutes from "./routes/itineraryRoutes";
import verificationRoutes from "./routes/verificationRoutes";
import routeRoutes from "./routes/routeRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/theme", themeRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/route", routeRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("DIVE Backend Server is running! 🎸");
});

export default app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}
