// POST /api/medicine/identify
import handler from "../_lib/identifyHandler.mjs";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default handler;
