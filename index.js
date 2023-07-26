const { Innertube, UniversalCache } = require("youtubei.js");
const readline = require("readline");
const { createSpinner } = require("nanospinner");
const { spawn } = require("child_process");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const spinner = createSpinner("Loading...").start();

(async () => {
  const config = require("./config.json");
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

  const searchTerm = await prompt("Type term to search: ");
  spinner.start();

  const search = await yt.music.search(searchTerm, { type: "all" });
  spinner.stop();
  console.clear();
  let i = 1;
  for (const music of search.songs.contents) {
    if (music.artists[0]) {
      console.log(`${i++}: ${music.title} by ${music.artists[0].name} at ${music.id}`);
    } else {
      console.log(`${i++}: ${music.title}`);
    }
  }

  const idx = await prompt("Which one? ");
  const song = search.songs.contents[idx - 1];
  if (song.id) {
    console.log(`Playing https://youtu.be/${song.id}`)
    const play = spawn("mpv", [`https://youtu.be/${song.id}`, "--no-video"]);
    // play.stdout.on("data", data => {
    //   console.log(`stdout: ${data}`);
    // });

    play.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
    });

    play.on('error', (error) => {
      console.log(`error: ${error.message}`);
    });

    play.on("close", async (code) => {
      await yt.session.oauth.cacheCredentials();
      process.exit(0)
    });
  }


  
  
})()