const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { Client, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

class MusicManager {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
        this.connection = null;
        this.player = null;
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.currentTrack = null;
        this.isPlaying = false;
        this.tracksPath = path.join(__dirname, 'tracks');
        
        this.loadTracks();
        this.setupPlayer();
    }

    loadTracks() {
        try {
            const files = fs.readdirSync(this.tracksPath)
                .filter(file => file.endsWith('.mp3'))
                .sort(); // Sort alphabetically
            
            this.tracks = files.map(file => ({
                name: file.replace('.mp3', '').replace(/^\d+_/, ''), // Remove number prefix
                path: path.join(this.tracksPath, file),
                filename: file
            }));
            
            console.log(`Loaded ${this.tracks.length} tracks:`);
            this.tracks.forEach((track, index) => {
                console.log(`  ${index + 1}. ${track.name}`);
            });
        } catch (error) {
            console.error('Error loading tracks:', error);
            this.tracks = [];
        }
    }

    setupPlayer() {
        this.player = createAudioPlayer();
        
        this.player.on(AudioPlayerStatus.Playing, () => {
            console.log(`🎵 Now playing: ${this.currentTrack?.name || 'Unknown'}`);
            this.isPlaying = true;
        });
        
        this.player.on(AudioPlayerStatus.Idle, () => {
            console.log('Track finished, playing next...');
            this.isPlaying = false;
            this.playNext();
        });
        
        this.player.on('error', (error) => {
            console.error('Audio player error:', error);
            this.isPlaying = false;
            setTimeout(() => this.playNext(), 1000); // Retry after 1 second
        });
    }

    async joinChannel(guild, channelId) {
        try {
            const channel = guild.channels.cache.get(channelId);
            if (!channel) {
                console.error(`Voice channel ${channelId} not found`);
                return false;
            }

            console.log(`Joining voice channel: ${channel.name}`);
            
            this.connection = joinVoiceChannel({
                channelId: channelId,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: false,
            });

            this.connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('Voice connection is ready!');
                this.connection.subscribe(this.player);
            
                // Set higher quality encoding if possible
                if (this.connection.state.networking) {
                    this.connection.state.networking.state.udp?.socket?.setBroadcast?.(true);
                }

                this.startPlayback();
            });

            this.connection.on(VoiceConnectionStatus.Disconnected, () => {
                console.log('Disconnected from voice channel');
                this.isPlaying = false;
            });

            this.connection.on('error', (error) => {
                console.error('Voice connection error:', error);
            });

            return true;
        } catch (error) {
            console.error('Error joining voice channel:', error);
            return false;
        }
    }

    startPlayback() {
        if (this.tracks.length === 0) {
            console.log('No tracks available to play');
            return;
        }

        this.playTrack(13);
    }

    playTrack(index) {
        if (index >= this.tracks.length) {
            index = 0; // Loop back to first track
        }

        this.currentTrackIndex = index;
        this.currentTrack = this.tracks[index];

        try {
            const resource = createAudioResource(this.currentTrack.path, {
                inlineVolume: true,
                inputType: 'arbitrary',
                metadata: {
                    title: this.currentTrack.name
                }
            });
            
            resource.volume?.setVolume(0.8);
            this.player.play(resource);

            this.client.rest.put(`/channels/${this.connection.joinConfig.channelId}/voice-status`, {
                body: {
                    status: `Playing: ${this.currentTrack.name}`,
                }
            }).catch(console.error);
        } catch (error) {
            console.error(`Error playing track ${this.currentTrack.name}:`, error);
            this.playNext();
        }
    }

    playNext() {
        const nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.playTrack(nextIndex);
    }

    getCurrentTrack() {
        if (!this.currentTrack) {
            return 'No track currently playing';
        }
        
        return `${this.currentTrack.name}`;
    }

    getPlaylist() {
        if (this.tracks.length === 0) {
            return 'No tracks loaded';
        }

        let playlist = `**Playlist:**\n`;
        this.tracks.forEach((track, index) => {
            const currentlyPlaying = index === this.currentTrackIndex;
            playlist += `${index + 1}. ${currentlyPlaying ? "**" + track.name + "**" : track.name}\n`;
        });

        return playlist;
    }
}

module.exports = MusicManager;
