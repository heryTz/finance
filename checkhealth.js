const httpOnly = require("http");
const https = require("https");

const URL = `${process.env.APP_URL}/api/checkhealth`;
const MAX_RETRIES = 20;
const DELAY = 5000;

const http = URL.startsWith("https:") ? https : httpOnly;

let attempts = 0;
const buildId = process.env.BUILD_ID;

function checkUrl() {
  return new Promise((resolve, reject) => {
    http
      .get(URL, (res) => {
        const { statusCode } = res;
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          if (statusCode === 200) {
            if (body.includes("nok")) {
              reject(new Error(`Unhealthy: ${body}`));
              return;
            }

            if (!body.includes(buildId)) {
              reject(
                new Error(
                  `Build ID mismatch. Expected ${buildId}, got ${body}`,
                ),
              );
              return;
            }

            console.log("Healthy");
            resolve();
          } else {
            reject(new Error(`App is not ready: status => ${statusCode}`));
          }
        });
      })
      .on("error", (e) => {
        reject(new Error(`Connection error: ${e.message}`));
      });
  });
}

async function retryCheckUrl() {
  while (attempts < MAX_RETRIES) {
    try {
      await checkUrl();
      process.exit(0);
    } catch (error) {
      attempts += 1;
      console.error(error.message);

      if (attempts >= MAX_RETRIES) {
        console.error(
          `Error: App is unreachable after ${MAX_RETRIES} attempts.`,
        );
        process.exit(1);
      } else {
        console.log(
          `New attempts after ${DELAY / 1000} seconds... (Attempt ${attempts}/${MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, DELAY));
      }
    }
  }
}

retryCheckUrl();
