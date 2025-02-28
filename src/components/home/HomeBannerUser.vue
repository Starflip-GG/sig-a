<template>
    <div class="home-banner-user">
        <div class="user-inner">
            <img src="@/assets/img/home_banner.png" class="background-image" />
            <img src="@/assets/img/knight.png" class="knight-image" />
            <div v-if="authUser.user === null" class="guest-content">
                <span class="welcome-text">SIGN IN TO START</span>
                <AuthButton />
            </div>
            <div v-else class="auth-content" :class="'auth-' + homeGetLevelColor">
                <span class="welcome-text">WELCOME BACK,</span>
                <div class="user-info">
                    <div class="avatar-container">
                        <AvatarImage :image="authUser.user.avatar" />
                    </div>
                    <span class="username" v-html="authUser.user.username"></span>
                </div>
                <div class="level-container">
                    <div class="level-box">
                        <div class="level-value">{{ homeGetLevel >= 99 ? 99 : homeGetLevel }}</div>
                    </div>
                    <div class="level-progress">
                        <div class="progress-bar" :style="{ width: (100 / homeGetLevelBet) * homeGetLevelProgress + '%' }"></div>
                        <div class="progress-text">
                            <span>{{ parseFloat(homeGetLevelProgress).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} / </span>
                            <span class="target">{{ parseFloat(homeGetLevelBet).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</span>
                        </div>
                    </div>
                    <div class="level-box">
                        <div class="level-value">{{ homeGetLevel >= 99 ? 100 : homeGetLevel + 1 }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthButton from '@/components/AuthButton';
import AvatarImage from '@/components/AvatarImage';

export default {
    name: 'HomeBannerUser',
    components: {
        AuthButton,
        AvatarImage
    },
    computed: {
        ...mapGetters(['authUser']),
        homeGetLevel() {
            const level = Math.floor(Math.pow(this.authUser.user.xp / 1000 / 100, 1 / 3));
            return level >= 100 ? 100 : level;
        },
        homeGetLevelColor() {
            if (this.homeGetLevel >= 76 && this.homeGetLevel < 100) return 'red';
            if (this.homeGetLevel >= 51 && this.homeGetLevel < 76) return 'orange';
            if (this.homeGetLevel >= 26 && this.homeGetLevel < 51) return 'green';
            if (this.homeGetLevel >= 2 && this.homeGetLevel < 26) return 'blue';
            if (this.homeGetLevel >= 100) return 'purple';
            return 'default';
        },
        homeGetLevelBet() {
            return this.homeGetLevel >= 100 ? 2970100 : (Math.pow(this.homeGetLevel + 1, 3) - Math.pow(this.homeGetLevel, 3)) * 100;
        },
        homeGetLevelProgress() {
            return Math.floor((this.homeGetLevel >= 100 ? 2970100 * 1000 : this.authUser.user.xp - (Math.pow(this.homeGetLevel, 3) * 100 * 1000)) / 10) / 100;
        }
    }
}
</script>

<style scoped>
.home-banner-user {
    width: calc(50% - 15px);
    height: 200px;
    position: relative;
    margin-right: 30px;
    border-radius: 15px;
    overflow: hidden;
    background: linear-gradient(50deg, #062641 0%, #021729 60%, rgba(9, 90, 239, 0.71) 75%, #021729 100%);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}

.user-inner {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 22px 180px 22px 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
}

.background-image {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 0;
}

.knight-image {
    height: 205px;
    position: absolute;
    bottom: -23px;
    right: -15px;
    transform: scaleX(-1);
    z-index: 0;
}

.guest-content,
.auth-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1;
}

.welcome-text {
    font-size: 28px;
    font-weight: 900;
    color: transparent;
    background: linear-gradient(90deg, #01fbbe, #03b6e3);
    -webkit-background-clip: text;
    background-clip: text;
    text-shadow: 0 0 25px rgba(3, 182, 227, 0.35);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar-container {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 2px solid #9e9e9e;
    overflow: hidden;
}

.username {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
}

.level-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
}

.level-box {
    width: 46px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #03121e;
    clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    border: 1px solid #9e9e9e;
}

.level-value {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff; /* Changed to white for consistency */
}

.level-progress {
    flex: 1;
    height: 13px;
    background: #03121e;
    position: relative;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ffffff 0%, #9e9e9e 100%);
}

.progress-text {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: 700;
    color: #9e9e9e;
}

.target {
    opacity: 0.5;
}

/* Level Color Themes */
.auth-blue .avatar-container,
.auth-blue .level-box {
    border-color: #559ee4;
}

.auth-green .avatar-container,
.auth-green .level-box {
    border-color: #b8e92d;
}

.auth-orange .avatar-container,
.auth-orange .level-box {
    border-color:rgb(11, 7, 1);
}

.auth-red .avatar-container,
.auth-red .level-box {
    border-color: #ff4e4e;
}

.auth-purple .avatar-container,
.auth-purple .level-box {
    border-color: #6953f1;
}

@media only screen and (max-width: 900px) {
    .home-banner-user {
        width: 100%;
        margin-right: 0;
    }
}

@media only screen and (max-width: 600px) {
    .user-inner {
        padding: 22px 20px;
 }

    .knight-image {
        display: none;
    }
}
</style>