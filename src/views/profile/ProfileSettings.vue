<template>
    <div class="profile-settings">
        <div class="settings-section">
            <div class="section-head">
                <div class="head-name">SETTING</div>
                <div class="head-action">ACTION</div>
            </div>
            <div class="section-content">
                <ProfileSettingsElement name="ANONYMOUS MODE">
                    <button v-on:click="userToggleAnonymous" class="button-toggle" 
                        v-bind:class="{ 'button-active': authUser.user.anonymous === true }" 
                        v-bind:disabled="socketSendLoading !== null">
                    </button>
                </ProfileSettingsElement>
                <ProfileSettingsElement name="SOUND VOLUME">
                    <input v-model="userVolume" v-on:input="soundSetVolume(userVolume)" type="range" min="0" max="1" step="0.01" 
                        v-bind:style="{ '--thumbColor': userVolume < 0.01 ? '#1c5064' : 'linear-gradient(255deg, rgb(0, 119, 255) 0%, rgb(0, 150, 170) 100%)' }">
                </ProfileSettingsElement>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-head">
                <div class="head-name">LINK ACCOUNTS</div>
            </div>
            <div class="section-content">
                <!-- Email Linking -->
                <ProfileSettingsElement name="EMAIL" 
                    v-bind:info="authUser.user.local?.emailVerified === undefined ? 'warning' : 'success'">
                    <button v-if="!authUser.user.local" 
                        v-on:click="modalsSetShow('Link')" 
                        class="button-link button-email">
                        <div class="button-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                            </svg>
                            LINK EMAIL
                        </div>
                    </button>
                    <button v-else-if="authUser.user.local.emailVerified === undefined" 
                        v-on:click="userVerifyButton()" 
                        class="button-verify" 
                        v-bind:disabled="authSendLoginLoading === true">
                        <div class="button-inner">VERIFY</div>
                    </button>
                    <div v-if="authUser.user.local" class="element-info">
                        <span>{{ userShowEmail ? authUser.user.local.email : '\u2022'.repeat(authUser.user.local.email?.length || 0) }}</span>
                        <button v-on:click="userToggleShowEmail()">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/>
                            </svg>
                        </button>
                    </div>
                </ProfileSettingsElement>

                <!-- Roblox Linking -->
                <ProfileSettingsElement name="ROBLOX" 
                    v-bind:info="authUser.user.roblox?.id === '0' ? 'warning' : 'success'">
                    <!-- Wenn Roblox-ID "0" ist -->
                    <button v-if="authUser.user.roblox?.id === '0'" 
                        v-on:click="modalsSetShow('LinkRoblox')" 
                        class="button-link button-roblox">
                        <div class="button-inner">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0L0 16L15.5 20L20 4L4 0ZM7.5 11L8.5 8L12 9L11 12L7.5 11Z"/>
                            </svg>
                            LINK ROBLOX
                        </div>
                    </button>

                    <!-- Wenn Roblox-ID nicht "0" ist -->
                    <button v-else v-on:click="modalsSetShow('LinkRoblox')" 
                        class="button-link button-roblox">
                        <div class="button-inner">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0L0 16L15.5 20L20 4L4 0ZM7.5 11L8.5 8L12 9L11 12L7.5 11Z"/>
                            </svg>
                            LINKED
                        </div>
                    </button>
                </ProfileSettingsElement>

                <!-- Discord Linking -->
                <ProfileSettingsElement name="DISCORD" v-bind:info="authUser.user.discordId === null ? 'warning' : 'success'">
                    <button 
                        v-if="authUser.user.discordId === null" 
                        @click="redirectToDiscordAuth" 
                        class="button-link button-google">
                        <div class="button-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
                                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                            </svg>
                            LINK DISCORD
                        </div>
                    </button>
                    <button v-else class="button-link button-google" @click="redirectToDiscordAuth">
                        <div class="button-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
                                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                            </svg>
                            LINKED
                        </div>
                    </button>
                </ProfileSettingsElement>
            </div>
        </div>
    </div>
</template>



<script>
import { mapGetters, mapActions } from 'vuex';
import ProfileSettingsElement from '@/components/profile/ProfileSettingsElement';

export default {
    name: 'ProfileSettings',
    components: {
        ProfileSettingsElement
    },
    data() {
        return {
            userVolume: 1,
            userShowEmail: false,
            userShowRoblox: false,
            userShowDiscord: false
        };
    },
    methods: {
        ...mapActions([
            'notificationShow', 
            'soundSetVolume',
            'modalsSetShow',
            'userSendUserAnonymousSocket',  
            'userSendUserDiscordSocket',
            'authSendCredentialsRequest'
        ]),
        userToggleAnonymous() {
            const data = { anonymous: !this.authUser.user.anonymous };
            this.userSendUserAnonymousSocket(data);
        },
        userToggleShowEmail() {
            this.userShowEmail = !this.userShowEmail;
        },
        userToggleShowRoblox() {
            this.userShowRoblox = !this.userShowRoblox;
        },

        redirectToDiscordAuth() {
            const backendOAuthUrl = `${process.env.VUE_APP_BACKEND_URL}/auth/discord`;

            console.log('Redirecting to:', backendOAuthUrl);

            const authWindow = window.open(
                backendOAuthUrl,
                'Discord Auth',
                'width=500,height=900'
            );

            const receiveMessage = (event) => {
                const backendOrigin = process.env.VUE_APP_BACKEND_URL.replace('/api', '').replace(/\/$/, '');
                console.log('Received message from:', event.origin);
                console.log('Expected origin:', backendOrigin);

                if (event.origin !== backendOrigin) {
                    console.error('Invalid origin:', event.origin);
                    return;
                }

                const { success, tokenDiscord } = event.data;

                if (success === 'true') {
                    this.$store.commit('auth_set_discord_token', tokenDiscord);
                    this.$store.dispatch('userSendUserDiscordSocket', { method: 'link', tokenDiscord });
                    this.notificationShow({ type: 'success', message: 'Discord Linked successfully' });
                } else {
                    this.notificationShow({ type: 'error', message: 'Discord authentication failed' });
                }

                window.removeEventListener('message', receiveMessage);
            };

            window.addEventListener('message', receiveMessage);
        },

        userToggleShowDiscord() {
            const discordLinked = !!this.authUser.user.discordId;
            const method = discordLinked ? 'unlink' : 'link';
            const tokenDiscord = !discordLinked ? this.authUser.discordToken : null;

            const data = { method, ...(method === 'link' ? { tokenDiscord } : {}) };

            this.$store.dispatch('userSendUserDiscordSocket', data);
        },

        userVerifyButton() {
            const data = { type: 'verify', email: this.authUser.user.local.email };
            this.authSendCredentialsRequest(data);
        }
    },
    computed: {
        ...mapGetters([
            'soundVolume',
            'authSendLoginLoading',
            'socketSendLoading',
            'authUser' 
        ])
    },
    created() {
        this.userVolume = this.soundVolume;
    }
};
</script>

<style scoped>
    .profile-settings {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .profile-settings .settings-section {
        width: 100%;
        margin-top: 25px;
    }

    .profile-settings .settings-section:first-child {
        margin-top: 0;
    }

    .profile-settings .section-head {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }

    .profile-settings .head-name,
    .profile-settings .head-action {
        font-size: 13px;
        font-weight: 700;
        color: #5e768e;
    }

    .profile-settings .section-content {
        width: 100%;
        margin-top: 15px;
    }

    .profile-settings .profile-settings-element button.button-toggle {
        width: 45px;
        height: 15px;
        position: relative;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .profile-settings .profile-settings-element button.button-toggle:disabled {
        cursor: not-allowed;
    }

    .profile-settings .profile-settings-element button.button-toggle::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #051924;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .profile-settings .profile-settings-element button.button-toggle::after {
        content: '';
        width: 25px;
        height: 19px;
        position: absolute;
        top: -2px;
        left: 0;
        background: #1c5064;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
    }

    .profile-settings .profile-settings-element button.button-toggle.button-active::after {
        transform: translate(20px, 0);
        background: linear-gradient(255deg, rgb(0, 119, 255) 0%, rgb(0, 150, 170) 100%);
    }

    .profile-settings .profile-settings-element input[type="range"] {
        width: 200px;
        height: 15px;
        position: relative;
        -webkit-appearance: none;
        -moz-apperance: none;
        background-color: transparent;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .profile-settings .profile-settings-element input[type="range"]::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #051924;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .profile-settings .profile-settings-element input[type="range"]::-webkit-slider-thumb {
        width: 25px;
        height: 19px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--thumbColor);
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        cursor: pointer;
    }

    .profile-settings .profile-settings-element input[type="range"]::-moz-range-thumb {
        width: 25px;
        height: 19px;
        background: var(--thumbColor);
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        cursor: pointer;
    }

    .profile-settings .profile-settings-element button.button-link,
    .profile-settings .profile-settings-element button.button-verify {
        height: 30px;
    }

    .profile-settings .profile-settings-element button.button-link {
        width: 150px;
    }

    .profile-settings .profile-settings-element button.button-verify {
        margin-right: 8px;
    }

    .profile-settings .profile-settings-element button.button-link .button-inner,
    .profile-settings .profile-settings-element button.button-verify .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 15px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background: #214059;
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    .profile-settings .profile-settings-element button.button-link.button-roblox .button-inner {
        background: #4178ca;
    }

    .profile-settings .profile-settings-element button.button-link.button-google .button-inner {
        background: #5865F2;
    }

    .profile-settings .profile-settings-element button.button-link .button-inner svg {
        width: 15px;
        margin-right: 8px;
        fill: #ffffff;
    }

    .profile-settings .profile-settings-element .element-info {
        width: 150px;
        height: 33px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px 0 10px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background: #0a2434;
    }

    .profile-settings .profile-settings-element .element-info span {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .profile-settings .profile-settings-element .element-info button {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        right: 10px;
        transform: translate(0, -50%);
    }

    .profile-settings .profile-settings-element .element-info button svg {
        fill: #5e768e;
        transition: fill 0.3s ease;
    }

    .profile-settings .profile-settings-element .element-info button:hover svg {
        fill: #ffffff;
    }

    @media only screen and (max-width: 450px) {

        .profile-settings .content-element.element-slider input {
            width: 130px;
        }

    }
</style>