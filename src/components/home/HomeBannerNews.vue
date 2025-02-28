<template>
    <div class="home-banner-news">
        <div class="news-inner">
            <button @click="homePreviousButton" class="button-previous">
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.398287 7.54628L6.62846 13.7763C6.77256 13.9206 6.96491 14 7.17001 14C7.37512 14 7.56747 13.9206 7.71157 13.7763L8.17038 13.3176C8.46893 13.0188 8.46893 12.533 8.17038 12.2345L2.93875 7.00291L8.17619 1.76548C8.32028 1.62127 8.39984 1.42902 8.39984 1.22403C8.39984 1.01882 8.32028 0.826572 8.17619 0.682249L7.71738 0.223667C7.57317 0.0794572 7.38092 1.1355e-05 7.17582 1.13371e-05C6.97072 1.13192e-05 6.77836 0.0794571 6.63426 0.223667L0.398287 6.45942C0.25385 6.60408 0.174517 6.79723 0.174972 7.00257C0.174517 7.20869 0.25385 7.40173 0.398287 7.54628Z" />
                </svg>
            </button>
            <div class="inner-content">
                <HomeNewsElement 
                    v-for="(banner, index) in homeBanners" 
                    :key="index" 
                    :banner="banner" 
                    :direction="homeDirection" 
                    :position="homePosition" 
                    :index="index" 
                />
            </div>
            <button @click="homeNextButton" class="button-next">
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.398287 7.54628L6.62846 13.7763C6.77256 13.9206 6.96491 14 7.17001 14C7.37512 14 7.56747 13.9206 7.71157 13.7763L8.17038 13.3176C8.46893 13.0188 8.46893 12.533 8.17038 12.2345L2.93875 7.00291L8.17619 1.76548C8.32028 1.62127 8.39984 1.42902 8.39984 1.22403C8.39984 1.01882 8.32028 0.826572 8.17619 0.682249L7.71738 0.223667C7.57317 0.0794572 7.38092 1.1355e-05 7.17582 1.13371e-05C6.97072 1.13192e-05 6.77836 0.0794571 6.63426 0.223667L0.398287 6.45942C0.25385 6.60408 0.174517 6.79723 0.174972 7.00257C0.174517 7.20869 0.25385 7.40173 0.398287 7.54628Z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import HomeNewsElement from '@/components/home/HomeNewsElement';

export default {
    name: 'HomeBannerNews',
    components: {
        HomeNewsElement
    },
    data() {
        return {
            homeBanners: ['Rain', 'Mode'],
            homePosition: 0,
            homeDirection: null,
            homeInterval: null
        }
    },
    methods: {
        homeStartInterval() {
            clearInterval(this.homeInterval);
            this.homeInterval = setInterval(() => {
                this.homeNextButton();
            }, 6000);
        },
        homePreviousButton() {
            this.homeDirection = 'left';
            this.homePosition = this.homePosition === 0 ? this.homeBanners.length - 1 : this.homePosition - 1;
            this.homeStartInterval();
        },
        homeNextButton() {
            this.homeDirection = 'right';
            this.homePosition = this.homePosition >= this.homeBanners.length - 1 ? 0 : this.homePosition + 1;
            this.homeStartInterval();
        }
    },
    beforeUnmount() {
        clearInterval(this.homeInterval);
    },
    mounted() {
        this.homeStartInterval();
    }
}
</script>

<style scoped>
.home-banner-news {
    width: calc(50% - 15px);
    height: 200px; /* Slightly taller for better visibility */
    position: relative;
    padding: 0;
    clip-path: polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
    background: linear-gradient(135deg, rgba(0, 123, 255, 0.9), rgba(0, 255, 255, 0.9)); /* More vibrant gradient */
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6); /* Deeper shadow for a floating effect */
    border-radius: 15px;
    overflow: hidden;
}

.home-banner-news::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(26, 72, 107, 0.8) 100%);
    z-index: 1;
}

.home-banner-news::after {
    content: '';
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    position: absolute;
    top: 1px;
    left: 1px;
    background-color: rgba(3, 29, 50, 0.9); /* Slightly transparent for depth */
    z-index: 0;
}

.news-inner {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
}

.inner-content {
    width: calc(100% - 80px); /* Adjusted for better spacing */
    height: 100%;
    position: relative;
    overflow: hidden;
}

.button-previous,
.button-next {
    width: 40px; /* Slightly larger buttons */
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(9, 32, 53, 0.8); /* Semi-transparent background */
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-previous:hover,
.button-next:hover {
    background-color: rgba(9, 32, 53, 1); /* Solid on hover */
}

.button-previous svg,
.button-next svg {
    fill: #93adc5;
 transition: fill 0.3s ease;
}

.button-next svg {
    transform: rotate(180deg);
}

.button-previous:hover svg,
.button-next:hover svg {
    fill: #ffffff;
}

@media only screen and (max-width: 900px) {
    .home-banner-news {
        width: 100%;
        height: 150px; /* Adjusted height for smaller screens */
        margin-top: 15px;
    }
}
</style> 