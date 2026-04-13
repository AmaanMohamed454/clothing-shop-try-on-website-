import { client } from "@gradio/client";

async function test() {
  try {
    const app = await client("yisol/IDM-VTON");
    const info = await app.view_api();
    console.log(JSON.stringify(info, null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
