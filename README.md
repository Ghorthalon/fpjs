# FPJS
## First Person JavaScript Shooter

I started this project in 2017 to get me familiar with JavaScript and game development in that environment.
This code, as it stands, is quite a mess, however it is my hope that with the help of the community we can clean the code up, add more features, and turn this into a fun multiplayer shooter for the web and electron/nw.js.
Below is an explanation of the overview, some things that need to be done to make the code easier to work with, and how you can get started developing or playing this game.

# Why is this open source?

The answer is really quite simple. Refactoring this code might take a little bit of time. I have other projects that mean more to me personally at the moment, so I would love to put more time into those. I'm constantly asked about this project though because I posted a demo recording a few years ago. I personally wouldn't be able to keep it alive as it stands. However, I'm more than willing to help people get started, review and accept pull requests, and make small patches here and there as time permits.
I have created a Discord server that you may feel free to join to talk about the development of this project. The invite link is:
https://discord.gg/VpFpqhv
If you do not use Discord, let me know and we can utilize one of the many bots to keep the channels in sync with other services like Matrix, Slack, IRC, etc.


# License

This source code is published under the [WTFPL](http://www.wtfpl.net/), which is a very permissive license which allows you to literally do whatever you want with this project. No guarantees of any kind. I will not be held liable for any damages, directly or indirectly, caused to you or any other entity in this universe by your involvement with this source code in any way.

# Overview

This text will go over the technical details of how this game is implemented. Gameplay will become apparent as I go along, however a general purpose playing guide will still have to be written. This project is not ready for this yet, however, so I will not go into too much detail here. You might be able to play it a little bit, but we're not there yet over all. Of course, if interest in this project grows and patches are submitted, this might change. 

## Architecture

This game is implemented in JavaScript and Node.JS.
The server uses Express to serve static game files, and socket.io to allow realtime communication between the client and the server. These libraries are included with the source code as of now, but the goal is to eventually have a build system utilizing Parcel Bundler or WebPack which will pull these in as dependencies.

## Cloning

Simply execute
```
git clone https://github.com/ghorthalon/fpjs
```

in your terminal. Change into the directory and run
```
npm install
```

to fetch all the dependencies the server requires.

## Running

### IMPORTANT

This repository does not come with any sound effects. For legal reasons, it is not possible for me to provide the sounds that were originally supposed to make it into this game. This is a big barrier of entry, however as community made sounds become available that allow for them to be used in this project freely, the assets will be able to be downloaded together with the game. This, sadly, is not the case at the moment. If you do have sounds that you can make available to this project, please get in touch by opening an issue on this repository. Only sounds with the proper license to be distributed can be endorsed by me officially, so before submitting any assets, please make sure that you have the proper rights to do so by checking the license information for the sounds that you plan to submit. You can find a list of the sounds required to play this game in this repository. At www/sounds/, the folder structure is preserved, and each folder contains a README file which will explain which sounds are supposed to go there. I'm very sorry for the inconvenience.
Most commercial sound libraries do not permit the redistribution of their sounds in raw form. As an example, the license of SFX Kit, a popular sound library often used for creating sounds for games, may not permit you to distribute these sounds for this project. However, a lot of sounds from FreeSound that are in the creative commons license will be fine, as long as they're credited. Make sure that you give credit where credit is due in this case. You may also feel free to record your own sound effects and edit them to fit this project if you have the hardware to do so. I will not be the only person judging whether or not a particular sound is fit for inclusion in this game. This, as well as most other things related to this project, will be a community effort. 

With that out of the way...

To run the game, you must start the server. Do so by executing
```
node index.js
```
in the root of the project.
The server will now listen on localhost port 3000. Simply go to localhost:3000 over http in Firefox or a Chromium-based browser. The assets have to be in .ogg format, and Safari sadly will not play those.

You can navigate menus using the arrow keys, the alphanumeric keys and enter where applicable.

### General Key Overview

All the keys required to play may be found in the input.js file in the www/js/ folder.

* WASD move
* Q and E snap you to the nearest cardinal direction
* Space jumps
* Control fires
* Holding shift will cause you to run

## Explanation of source files

### Server

The server's entry point is in index.js in the root of the project. 

### Client

The client badly needs to be refactored to use new ES6-style imports. Currently, all files are imported using script tags in www/index.html. This is not ideal at all for this project in my opinion.

## What needs to be done?

* Refactor the entire client to make use of modern ECMAScript modules and modern ECMAScript features like let and const instead of var, arrow functions for inline-functions, array.map() instead of imperative for-loops. Always choose declarative over imperative where possible, except in the cases where imperative might be more readable. If you're unsure, open an issue and ask. This is probably the biggest bulk of the work that needs to be done to make this codebase nicer to work with.
* Remove the many globals that are scattered around this project and integrate them into their proper module. Any remaining globals should find a more developer friendly way of being accessed, modified and stored.
* Add a better timed game loop than relying solely on requestAnimationFrame.
* Try to decouple a lot of the knots in the architecture of the client. Ideally, as little tight coupling as possible. Remove main references to Sono and contain them within their own modules or classes to make it easier to switch to something else at a later time.
* Remove jQuery as a dependency entirely. It's used for keyboard input. I wrote AGK-Input for this, which you can find on my GitHub. (While you're at it, that also might need a little bit of clean up ;) )
* The server is very naive and will accept any input made by the player. This is an easy target for cheating. This must be mitegated.
* Find free-to-use, high quality sound effects as main assets for this game. Mods are encouraged as well, maybe even different sound sets for different game modes.
* Write game modes and extend the game mode API for the server.
* Refactor the map maker to behave generally more like how one would expect a grid-based map editor to work for audio games. Good examples here would be something like Sable or RTR's old map maker.
* Anything that might come to your mind, please open an issue for it and let's have a discussion!

## What may I do?

I won't impose any limits to what you can do. You may, for example, feel free to:

* Rewrite the server logic in another language for performance reasons.
** However, please first consider trying to write performance critical bits of code in a language that can compile down to WASM. It should be easy for as many people as possible to make changes. JavaScript is a very universally used language and it's relatively easy to set up and develop with. This may be arguable though, so if you do feel like this is not the case, simply open an issue about it and let's talk.
* Convert the project source code to TypeScript.
** Type safety is important, and TypeScript is very easy to understand if you're familiar with JavaScript.
* Add build pipelines
** I would actually prefer that this gets done as one of the first new changes to this codebase, as can be seen above. I would also not be opposed to using ECMAScript modules directly from the browser natively, but there are browsers that are popular which do not have this functionality yet but that do support WebAudio API.
* Split the server logic and game logic into their own packages.
** I would prefer development to happen in a monorepo for ease of maintenance. These projects might grow very large, however, so splitting them up might be necessary at some point. You may feel free to utilize a system like Lerna to split the code up into smaller, reusable pieces. This allows you to keep multiple, separated packages in one repo. 
* Replace the roll-your-own physics with an actual physics engine
** A good example here could be Cannon.js.

Please note: These are simply examples. As always, if you're uncertain, simply open an issue about it and start a discussion!

# Goals

My goal is for this project to become a community-maintained, free first person shooter for the web and desktop, possibly even mobile. I'm sure with enough effort we can clean up this mess and turn it into something beautiful. I really hope I've sparked your interest in this and gave you a solid base to work upon. Please do feel free to fork, make changes, and submit pull requests back to me. If interest grows, more maintainers will be added to the project, eliminating me as a BDFL and really turning this into a community effort. All the work I've done is hereby free for you to dig in. I really hope that this can be the start of something beautiful.
Be good people. <3