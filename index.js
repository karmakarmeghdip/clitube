const { Innertube, UniversalCache } = require("youtubei.js");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

(async ()=>{
  const config = require("./config.json");
  console.log(config);

  const yt = await Innertube.create({
    ...config,
    cache: new UniversalCache(true, "./.cache")
  });

  yt.session.on("auth-pending", (data)=>{
    console.log(`Enter ${data.verification_url} in your browser and enter ${data.user_code}...`);
  })

  yt.session.on("auth", ({ credentials })=>{
    console.log(`Signed in successfully: ${credentials}`);
  })

  yt.session.on("update-credentials", async ({ credentials })=> {
    console.log(`Credentials updated ${ credentials }`);
    await yt.session.oauth.cacheCredentials();
  })

  await yt.session.signIn();

  const searchTerm = await prompt("Type term to search: ");

  const search = await yt.music.search(searchTerm, {type: "all"});
  const song = search.songs.endpoint.toURL()
  console.log(song)
  await yt.session.oauth.cacheCredentials();
})()