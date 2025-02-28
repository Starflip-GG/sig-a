// Importiere Sounds oder setze Pfade zu den Audiodateien
const audioInstances = {};

const playSound = (soundPath, id = null, volume = 1) => {
    if (id && audioInstances[id]) {
        audioInstances[id].pause();
        audioInstances[id].currentTime = 0;
    }

    const audio = new Audio(soundPath);
    audio.volume = volume;
    if (id) {
        audioInstances[id] = audio;
    }
    audio.play();
};

const stopAllSounds = () => {
    Object.values(audioInstances).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
};


const state = {
    crashGame: null,
    crashMultiplier: 1,
    crashBets: [],
    crashHistory: []
};

const getters = {
    crashGame: state => state.crashGame,
    crashMultiplier: state => state.crashMultiplier,
    crashBets: state => state.crashBets,
    crashHistory: state => state.crashHistory
};

const mutations = {
    crash_set_game(state, game) {
        state.crashGame = game;
    },
    crash_set_multiplier(state, multiplier) {
        state.crashMultiplier = multiplier;
    },
    crash_set_bets(state, bets) {
        state.crashBets = bets;
    },
    crash_add_bets(state, bet) {
        state.crashBets.unshift(bet);
    },
    crash_update_bets(state, bet) {
        const index = state.crashBets.findIndex((element) => element._id === bet._id);
        if (index !== -1) {
            state.crashBets.splice(index, 1, bet);
        }
    },
    crash_set_history(state, history) {
        state.crashHistory = history;
    },
    crash_add_history(state, game) {
        state.crashHistory.unshift(game);
    },
    crash_remove_last_history(state) {
        state.crashHistory.pop();
    }
};

const actions = {
    crashSocketInit({ commit, dispatch }, data) {
        commit('crash_set_game', data.game);
        commit('crash_set_bets', data.bets);
        commit('crash_set_history', data.history);

        // Seite sichtbar/unsichtbar überwachen
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAllSounds(); // Sounds stoppen, wenn die Seite unsichtbar wird
            }
        });
    },
    crashSocketGame({ commit, getters }, data) {
        commit('crash_set_game', data.game);

        if (data.game.state === 'completed') {
            commit('crash_add_history', data.game);

            if (getters.crashHistory.length > 25) {
                commit('crash_remove_last_history');
            }

            commit('crash_set_multiplier', 1);

            stopAllSounds(); // Stoppe alle laufenden Sounds
        } else if (data.game.state === 'created') {
            commit('crash_set_bets', []);
        }
    },
    crashSocketTick({ commit }, data) {
        commit('crash_set_multiplier', data.multiplier);
    },
    crashSocketBet({ getters, commit }, data) {
        if (getters.crashBets.some((element) => element._id === data.bet._id)) {
            commit('crash_update_bets', data.bet);
        } else {
            commit('crash_add_bets', data.bet);
            playSound(require('@/assets/sounds/success.mp3'), 'success', getters.soundVolume);
        }
    },
    crashSendBetSocket({ getters, commit, dispatch }, data) {
        if (getters.socketCrash === null || getters.socketSendLoading !== null) {
            return;
        }
        commit('socket_set_send_loading', 'CrashBet');

        getters.socketCrash.emit('sendBet', data, (res) => {
            if (res.success === true) {
                commit('auth_update_user', res.user);
            } else {
                dispatch('notificationShow', res.error);
            }
            commit('socket_set_send_loading', null);
        });
    },
    crashSendCashoutSocket({ getters, commit, dispatch }, data) {
        if (getters.socketCrash === null || getters.socketSendLoading !== null) {
            return;
        }
        commit('socket_set_send_loading', 'CrashCashout');

        getters.socketCrash.emit('sendCashout', data, (res) => {
            if (res.success === false) {
                dispatch('notificationShow', res.error);
            } else {
                playSound(require('@/assets/sounds/cash.mp3'), 'cash', getters.soundVolume);
            }
            commit('socket_set_send_loading', null);
        });
    }
};


const crash = {
    state,
    mutations,
    actions,
    getters
};

export default crash;
