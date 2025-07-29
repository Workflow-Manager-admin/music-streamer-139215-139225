#!/bin/bash
cd /home/kavia/workspace/code-generation/music-streamer-139215-139225/music_player_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

