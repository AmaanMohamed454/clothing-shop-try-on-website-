import { client } from "@gradio/client";

async function test() {
  try {
    const app = await client("yisol/IDM-VTON");
    console.log("App loaded. Endpoints:");
    console.log(app.config.dependencies);
  } catch(e) {
    console.error(e);
  }
}
test();
