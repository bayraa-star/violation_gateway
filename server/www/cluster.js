const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;

// Graceful worker shutdown function
function shutdownWorker(server) {
  console.log(`Worker ${process.pid} is shutting down...`);
  server.close(() => {
    console.log(`Worker ${process.pid} has closed all connections.`);
    process.exit(0); // Exit gracefully
  });

  // Force shutdown if the server hasn't closed after 5 seconds
  setTimeout(() => {
    console.error(
      `Worker ${process.pid} did not close in time. Forcing shutdown.`
    );
    process.exit(1); // Force shutdown
  }, 5000);
}

if (cluster.isMaster) {
  console.log(
    `Master process is running. Forking for ${Math.min(numCPUs, 16)} CPUs.`
  ); // Limit workers to 2

  const numWorkers = Math.min(numCPUs, 16); // Adjust the number of workers
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`
    );
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log("Waiting before forking a new worker...");
      setTimeout(() => {
        console.log("Forking a new worker...");
        cluster.fork();
      }, 1000); // Delay to avoid crash loops
    }
  });

  process.on("uncaughtException", (err) => {
    console.error(
      `Master process encountered an unhandled exception: ${err.message}`
    );
    console.error(err.stack);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error(
      `Unhandled Rejection in master at: ${promise}, reason: ${reason}`
    );
  });
} else {
  // Worker processes will import the application and connect to MongoDB
  const app = require("../index");

  // Ensure the PORT environment variable is set and use it in the worker
  const PORT = process.env.PORT; // Use PORT from environment or default

  // Start the server in the worker process
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worker ${process.pid} is handling requests on port ${PORT}`);
  });

  process.on("SIGTERM", () => shutdownWorker(server));
  process.on("SIGINT", () => shutdownWorker(server));

  process.on("uncaughtException", (err) => {
    console.error(
      `Worker ${process.pid} encountered an unhandled exception: ${err.message}`
    );
    console.error(err.stack); // Log full stack trace
    shutdownWorker(server);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error(
      `Unhandled Rejection in worker at: ${promise}, reason: ${reason}`
    );
    shutdownWorker(server);
  });
}

