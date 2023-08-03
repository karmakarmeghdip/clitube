import { play } from "./utils/play.js";
import { input, select } from "@inquirer/prompts";

export async function search_music(spinner, yt) {
    const name = await input({ message: "Type term to search: " });
    spinner.start();
    const search = await yt.music.search(name, { type: "song" });
    spinner.stop();
    console.clear();
    const options = [];
    for (const music of search.songs.contents) {
        options.push({
            name: (music.artists[0] ? (music.title + " by " + music.artists[0].name) : music.title),
            value: music.id
        })
    }

    const song_id = await select({message: "What to play?", choices: options})
    if (song_id) {
        play(song_id);
        // return song_id;
    }
}