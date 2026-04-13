import { client } from "@gradio/client";
import fs from 'fs';

async function test() {
  try {
    console.log("Connecting to Gradio...");
    const app = await client("yisol/IDM-VTON");
    
    // Create dummy blobs
    const bg = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], {type: "image/png"});
    const cloth = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], {type: "image/png"});
    
    console.log("Sending prediction...");
    const result = await app.predict("/tryon", [
        { "background": bg, "layers": [], "composite": null },
        cloth,
        "Sleeve Round Neck T-shirts",
        true,
        false,
        30,
        42
    ]);
    console.log(JSON.stringify(result.data, null, 2));
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
