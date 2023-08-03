import { Innertube, UniversalCache } from "youtubei.js";
import { createSpinner } from "nanospinner";
import config from "./config.json" assert {type: "json"};
// import { prompt } from "./src/utils/input.js";
import { input } from "@inquirer/prompts";
import { search_music } from "./src/music.js";


const spinner = createSpinner("Loading...").start();

(async () => {
  
  // console.log(config);

  const yt = await Innertube.create({
    ...config,
    cache: new UniversalCache(true, "./.cache")
  });

  yt.session.on("auth-pending", (data) => {
    console.log(`Enter ${data.verification_url} in your browser and enter ${data.user_code}...`);
  })

  yt.session.on("auth", ({ credentials }) => {
    // console.log(`Signed in successfully: ${credentials}`);
  })

  yt.session.on("update-credentials", async ({ credentials }) => {
    // console.log(`Credentials updated ${ credentials }`);
    await yt.session.oauth.cacheCredentials();
  })

  await yt.session.signIn();

  spinner.stop();
  console.clear();
  const id = await search_music(spinner, yt)
  // const inf = await yt.getInfo(id)
  // console.dir(inf)
})()