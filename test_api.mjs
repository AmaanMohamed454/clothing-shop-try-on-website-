import { client } from "@gradio/client";

async function testSpace(space, endpoint, payload) {
  try {
    console.log(`Testing ${space}...`);
    const app = await client(space);
    let start = Date.now();
    const result = await app.predict(endpoint, payload);
    console.log(`Success ${space} in ${Date.now() - start}ms:`, result.data[0]);
    return true;
  } catch (e) {
    console.log(`Failed ${space}:`, e.message.substring(0, 100));
    return false;
  }
}

async function run() {
  const dummyImg = await fetch("https://picsum.photos/200/300").then(r => r.blob());
  
  await testSpace("levihsu/OOTDiffusion", "/process_hd", [
    dummyImg,
    dummyImg,
    "Upper-body",
    1,
    20
  ]);
  
  await testSpace("Nymbo/Virtual-Try-On", "/tryon", [
    { "background": dummyImg, "layers": [], "composite": dummyImg },
    dummyImg,
    "a photo",
    true,
    false,
    30,
    1234
  ]);

  await testSpace("yisol/IDM-VTON", "/tryon", [
    { "background": dummyImg, "layers": [], "composite": dummyImg },
    dummyImg,
    "a photo",
    true,
    false,
    30,
    1234
  ]);
}
run();
