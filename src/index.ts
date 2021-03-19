const express = require("express");
// import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "reflect-metadata";
// Own
import errorHandler from "./utils/errorHandler";

// ENTITIES
import User from "./models/User";
import Ruangan from "./models/Ruangan";
// import Barang from "./entities/Barang";
// import DetailBarang from "./entities/DetailBarang";
// import TransaksiBarang from "./entities/TransaksiBarang";
// import AutoId from "./entities/AutoId";
dotenv.config();

// Router
import userRouter from "./routes/user.routes";
import ruanganRouter from "./routes/ruangan.routes";
import authRouter from "./routes/auth.routes";
// import barangRouter from "./routes/barang.routes";
// import authRouter from "./routes/auth.routes";
// import inventarisRouter from "./routes/inventaris.routes";
import { Application } from "express";
// Error Handler

const main = async (): Promise<void> => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [User, Ruangan],
    });
    console.log("Database Connected");

    const app: Application = express();

    if (process.env.NODE_ENV !== "production") {
      app.use(morgan("dev"));
    }
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
      })
    );
    app.use(helmet());
    app.use(cookieParser());
    app.use(express.json());
    app.use("/uploads", express.static("uploads"));
    //   ROUTE
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/ruangan", ruanganRouter);
    app.use("/api/v1/auth", authRouter);
    // app.use("/api/v1/barang", barangRouter);
    // app.use("/api/v1/inventaris", inventarisRouter);

    app.use(errorHandler);

    app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        status: "error",
        message: "End Point Tidak Ditemukan !",
      });
    });

    const port = process.env.PORT;

    app.listen(port, () => {
      console.log(`App Running in Port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
main();
