import { spawn } from "child_process"

export function play(id) {
    console.log(`Playing https://youtu.be/${id}`)
    const play = spawn("mpv", [`https://youtu.be/${id}`, "--no-video"]);
    // play.stdout.on("data", data => {
    //   console.log(`stdout: ${data}`);
    // });

    // play.stderr.on("data", data => {
    //   console.log(`stderr: ${data}`);
    // });

    // play.on('error', (error) => {
    //   console.log(`error: ${error.message}`);
    // });

    play.on("close", async (code) => {
      await yt.session.oauth.cacheCredentials();
      return
    });
}