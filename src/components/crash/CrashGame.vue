<template>
    <div class="crash-game">
        <div class="game-graph" ref="crashGraph">
            <canvas id="canvas-graph"></canvas>
        </div>
        <div class="game-info">
            <div class="info-network">
                <div class="network-point"></div>
                <span>NETWORK STATUS</span>
            </div>
            <div class="info-profit">
                <transition name="fade">
                    <div v-if="crashProfitInfo === true" class="profit-amount">
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        250,000
                    </div>
                </transition>
                <button v-on:click="crashSetProfitInfo(!crashProfitInfo)">
                    <IconInfo />
                    MAX PROFIT
                </button>
            </div>
        </div>
        <div v-if="crashGame !== null" class="game-inner">
            <!-- Meteor Animation -->
            <div class="meteor-container">
                <div class="meteor"></div>
                <div class="meteor"></div>
                <div class="meteor"></div>
            </div>
            <div v-if="crashGame.state === 'completed'" class="inner-completed">
                <div class="completed-multiplier">
                    {{ parseFloat(crashGame.outcome / 100).toFixed(2) }}
                </div>
                <div class="completed-over">ROUND OVER</div>
            </div>
            <div v-else-if="crashGame.state === 'rolling'" class="inner-rolling">
                <div class="rolling-multiplier">
                    <span class="gradient-green">{{ parseFloat(Math.floor(crashMultiplier / 1000) / 100).toFixed(2) }}</span>
                </div>
                <div class="rolling-payout">CURRENT PAYOUT</div>
                <transition name="fade">
                    <div
                        v-if="
                            authUser.user !== null &&
                            crashBets.some(
                                (element) => element.user._id === authUser.user._id && element.multiplier === undefined
                            ) === true
                        "
                        class="rolling-amount"
                    >
                        <img src="@/assets/img/icons/coin.svg" alt="icon" />
                        <div class="amount-value">
                            <span>+{{ crashFormatValue(crashGetPayoutAmount).split(".")[0] }}</span>.{{
                                crashFormatValue(crashGetPayoutAmount).split(".")[1]
                            }}
                        </div>
                    </div>
                </transition>
            </div>
            <div v-else class="inner-waiting">
                <div class="waiting-status">PREPARING ROUND</div>
                <div class="waiting-timer">{{ crashText }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CrashGraph from '@/components/crash/CrashGraph';
import IconInfo from '@/components/icons/IconInfo';

export default {
    name: 'CrashGame',
    components: {
        IconInfo
    },
    data() {
        return {
            crashTimerRepeater: null,
            crashRunRepeater: null,
            crashGraphInstance: null,
            crashWidth: 0,
            crashProfitInfo: false,
            crashText: 'STARTING IN 20.00s',
            crashMultiplier: 1.0001,
            audioContext: null,
            audioInstances: {} // Audio-Elemente verwalten
        };
    },
    methods: {
        initAudioContext() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.audioContext.resume().catch((err) => {
                    console.warn('AudioContext konnte nicht aktiviert werden:', err);
                });
            }
        },
        playSound(soundPath, id = null, startTime = 0) {
            if (id && this.audioInstances[id]) {
                this.audioInstances[id].pause();
                this.audioInstances[id].currentTime = 0;
                delete this.audioInstances[id];
            }

            const audio = new Audio(soundPath);
            audio.currentTime = startTime;

            if (id) {
                this.audioInstances[id] = audio;
            }

            if (this.audioContext) {
                const track = this.audioContext.createMediaElementSource(audio);
                track.connect(this.audioContext.destination);
            }

            audio.play().catch((err) => {
                console.warn(
                    `Audio konnte nicht abgespielt werden. Der Browser blockiert möglicherweise Autoplay: ${err}`
                );
            });
        },
        stopAllSounds() {
            Object.entries(this.audioInstances).forEach(([id, audio]) => {
                audio.pause();
                audio.currentTime = 0;
                delete this.audioInstances[id];
            });
        },
        enableSilentAudio() {
            const silentAudio = new Audio();
            silentAudio.src =
                'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAA=';
            silentAudio.play().catch((err) => {
                console.warn('Stiller Audio-Workaround fehlgeschlagen:', err);
            });
        },
        crashFormatValue(value) {
            return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString();
        },
        crashSetProfitInfo(value) {
            this.crashProfitInfo = value;
        },
        crashStartTimer() {
            const timeEnding = new Date(this.crashGame.createdAt).getTime() + 1000 * 6;
            const timeLeft = (timeEnding - (new Date().getTime() + this.generalTimeDiff)) / 1000;

            this.crashText = 'STARTING IN ' + timeLeft.toFixed(2) + 's';

            if (timeLeft <= 0) {
                this.crashText = 'PENDING...';
            } else {
                this.crashTimerRepeater = requestAnimationFrame(this.crashStartTimer);
            }
        },
        crashStartMutiplier() {
            const elapsed =
                new Date().getTime() + this.generalTimeDiff - new Date(this.crashGame.updatedAt).getTime();
            const multiplier = Math.floor(100000 * Math.pow(Math.E, 0.00006 * elapsed));

            this.crashMultiplier = multiplier === 100000 ? 100001 : multiplier;

            CrashGraph.Engine.multi = this.crashMultiplier / 100000;

            this.crashRunRepeater = requestAnimationFrame(this.crashStartMutiplier);
        }
    },
    computed: {
        ...mapGetters(['authUser', 'generalTimeDiff', 'crashGame', 'crashBets']),
        crashGetPayoutAmount() {
            const userBet = this.crashBets.find(
                (element) => element.user._id === this.authUser.user._id
            );
            return userBet ? Math.floor(userBet.amount * (this.crashMultiplier / 100000)) : 0;
        }
    },
    watch: {
        crashGame: {
            handler(data, oldData) {
                if (data.state === 'created') {
                    CrashGraph.Engine.multi = 1.0001;
                    CrashGraph.Engine.gameState = 'STARTING';

                    this.playSound(require('@/assets/sounds/game_start.mp3'), 'gameStart');
                    this.crashStartTimer();
                } else if (data.state === 'rolling') {
                    CrashGraph.Engine.multi = 1.0001;
                    CrashGraph.Engine.gameState = 'IN_PROGRESS';

                    this.crashMultiplier = 1.0001;
                    this.crashStartMutiplier();
                } else if (data.state === 'completed') {
                    CrashGraph.Engine.multi = 1.0001;
                    CrashGraph.Engine.gameState = 'ENDED';

                    this.stopAllSounds();
                    this.playSound(require('@/assets/sounds/explosion.mp3'), 'explosion');
                    cancelAnimationFrame(this.crashRunRepeater);
                }
            },
            deep: true
        }
    },
    mounted() {
        this.initAudioContext();
        this.enableSilentAudio();

        const meteorContainer = this.$el.querySelector(".meteor-container");
        const numMeteors = 15;

        for (let i = 0; i < numMeteors; i++) {
        const meteor = document.createElement("div");
        meteor.className = "meteor";

        // Zufällige Eigenschaften für Meteoriten
        meteor.style.setProperty("--random-x", Math.random().toString());
        meteor.style.setProperty("--meteor-size", `${15 + Math.random() * 40}px`);
        meteor.style.setProperty("--fall-duration", `${3 + Math.random() * 2}s`);
        meteor.style.setProperty("--smoke-duration", `${1 + Math.random()}s`);
        meteor.style.setProperty("--meteor-color", `hsl(${Math.random() * 50}, 100%, 60%)`);
        meteor.style.setProperty("--meteor-color-dark", `hsl(${Math.random() * 50}, 100%, 30%)`);
        meteor.style.animationDelay = `${Math.random() * 3}s`;

        meteorContainer.appendChild(meteor);
        }

        let canvas = document.querySelector('#canvas-graph');

        this.crashWidth = this.$refs.crashGraph.clientWidth - 10;

        this.crashGraphInstance = new CrashGraph.Graph();
        this.crashGraphInstance.startRendering(canvas, {
            width: this.crashWidth,
            height: 435
        });

        CrashGraph.Engine.multi = 1;

        if (this.crashGame.state === 'created') {
            CrashGraph.Engine.gameState = 'STARTING';
            this.crashStartTimer();
        } else if (this.crashGame.state === 'rolling') {
            CrashGraph.Engine.gameState = 'IN_PROGRESS';

            const elapsed =
                new Date().getTime() + this.generalTimeDiff - new Date(this.crashGame.updatedAt).getTime();
            const elapsedSeconds = elapsed / 1000;

            this.crashStartMutiplier();

            this.stopAllSounds();
            this.playSound(require('@/assets/sounds/game_start.mp3'), 'rolling', elapsedSeconds);
        } else {
            this.crashText = 'PENDING...';
        }
    },
    destroyed() {
        cancelAnimationFrame(this.crashTimerRepeater);
        cancelAnimationFrame(this.crashRunRepeater);
        this.crashGraphInstance.stopRendering();
        this.stopAllSounds();
    }
};
</script>

<style scoped>
    .crash-game {
        width: 100%;
        height: 460px;
        position: relative;
        border-radius: 15px;
        background: linear-gradient(0deg, rgba(5, 31, 51, 0.4), rgba(5, 31, 51, 0.4)),
            radial-gradient(100% 100% at 50% 50%,
                rgba(156, 88, 223, 0.3) 0%,
                rgba(0, 0, 0, 0) 100%),
            rgba(112, 73, 197, 0.05);
        border: 1px solid rgba(20, 68, 104, 0.35);
        box-shadow: inset 0px 0px 35px rgba(0, 0, 0, 0.65);
    }

    .crash-game .game-graph {
        position: absolute;
        top: 20px;
        bottom: 5px;
        left: 5px;
        right: 5px;
    }

    .graph-crash {
        height: 460px;
    }

    .crash-game .game-info {
        width: 100%;
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top: 15px;
        left: 0;
        padding: 0 20px;
    }

    .crash-game .info-network {
        display: flex;
        align-items: center;
    }
    
    .crash-game .info-network span {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .crash-game .network-point {
        width: 10px;
        height: 10px;
        margin-right: 10px;
        border-radius: 50%;
        background: linear-gradient(255deg,rgb(0, 157, 255) 0%,rgb(0, 111, 170) 100%), #d9d9d9;
        box-shadow: 0px 0px 8pxrgb(1, 148, 222);
    }

    .crash-game .info-profit {
        display: flex;
        align-items: center;
    }

    .crash-game .info-profit button {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
    }

    .crash-game .info-profit button svg {
        margin-right: 8px;
        fill: #ffffff;
    }

    .crash-game .profit-amount {
        display: flex;
        align-items: center;
        margin-right: 10px;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;

    }

    .crash-game .profit-amount.fade-enter-active,
    .crash-game .profit-amount.fade-leave-active {
        transition: opacity 0.5s;
    }

    .crash-game .profit-amount.fade-enter-from,
    .crash-game .profit-amount.fade-leave-to {
        opacity: 0;
    }

    .crash-game .profit-amount img {
        width: 15px;
        height: 15px;
        margin-right: 8px;
    }

    .crash-game .game-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        background-image: url("~@/assets/img/crash_background.png");
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        z-index: -1;
    }

    .crash-game .inner-completed,
    .crash-game .inner-rolling,
    .crash-game .inner-waiting {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .crash-game .inner-rolling {
        position: relative;
    }

    .crash-game .completed-multiplier,
    .crash-game .rolling-multiplier {
        line-height: 88px;
        font-size: 84px;
        font-weight: 700;
        color: #f55046;
    }

    .crash-game .completed-over,
    .crash-game .rolling-payout {
        font-size: 18px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .crash-game .rolling-amount {
        position: absolute;
        display: flex;
        align-items: center;
        bottom: -6px;
        left: 50%;
        transform: translate(-50%, 100%);
    }

    .crash-game .rolling-amount img {
        width: 26px;
        height: 26px;
        margin-right: 10px;
    }

    .crash-game .amount-value {
        font-size: 16px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .crash-game .amount-value span {
        font-size: 24px;
        font-weight: 800;
        color: #ffffff;
    }

    .crash-game .inner-waiting img {
        margin-top: 25px;
    }

    .crash-game .waiting-status {
        text-align: center;
        font-size: 54px;
        font-weight: 800;
        text-shadow: 0px 5px 3px rgba(0, 0, 0, 0.15);
        background: linear-gradient(255deg,rgb(0, 170, 255) 0%,rgb(0, 79, 170) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    .crash-game .waiting-timer {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
    }

    @media only screen and (max-width: 550px) {

        .crash-game .info-network span {
            display: none;
        }

    }

    .meteor-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.meteor-container >>> .meteor {
  position: absolute;
  top: -10%;
  right: calc(100% * var(--random-x, 0));
  width: var(--meteor-size, 20px);
  height: var(--meteor-size, 20px);
  background: radial-gradient(circle, var(--meteor-color, #ff5722), var(--meteor-color-dark, #bf360c));
  box-shadow: 0 0 15px rgba(255, 87, 34, 0.7), 0 0 30px rgba(255, 87, 34, 0.5);
  border-radius: 50%;
  transform: rotate(90deg);
  animation: meteor-fall var(--fall-duration, 1s) linear infinite;
  z-index: 1; /* Meteor liegt über dem Rauch */
}

.meteor-container >>> .meteor::after {
  content: '';
  position: absolute;
  top: -480%; /* Rauch unterhalb des Meteors */
  left: 50%;
  transform: translateX(-50%);
  width: calc(var(--meteor-size, 20px) * 2);
  height: calc(var(--meteor-size, 20px) * 4);
  background: radial-gradient(circle, rgba(100, 100, 100, 0.5), rgba(50, 50, 50, 0));
  animation: smoke-rise var(--smoke-duration, 1.5s) linear infinite;
  filter: blur(6px);
  opacity: 0.6;
  z-index: 0; /* Rauch liegt hinter dem Meteor */
}

@keyframes meteor-fall {
  from {
    transform: translate(0, 0) rotate(45deg);
    opacity: 1;
  }
  to {
    transform: translate(-200vw, 200vh) rotate(80deg);
    opacity: 0;
  }
}

@keyframes smoke-rise {
  0% {
    transform: translateX(-50%) translateY(30%);
    opacity: 0.7;
  }
  100% {
    transform: translateX(-50%) translateY(-150px);
    opacity: 0;
  }
}

</style>
