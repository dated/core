import { app } from "@arkecosystem/core-container";
import fs from "fs-extra";

const logger = app.resolvePlugin("logger");
const snapshotManager = app.resolvePlugin("snapshots");

export default async (options) => {
  if (
    options.filename &&
    !fs.existsSync(
      `${process.env.ARK_PATH_DATA}/snapshots/${process.env.ARK_NETWORK_NAME}/${
      options.filename
      }`,
    )
  ) {
    logger.error(`Verify not possible. Snapshot ${options.filename} not found.`);
    logger.info(
      "Use -f parameter with just the filename and not the full path.",
    );
  } else {
    await snapshotManager.verifyData(options);
  }
};