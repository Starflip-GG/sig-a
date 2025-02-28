<template>
    <div class="home">
        <div class="home-banner">

            <HomeBannerUser />
            <HomeBannerNews />

        </div>
        <div class="home-featured">
            <div class="featured-title">ALL GAMES</div>
            <div class="featured-content">

                <HomeGameElement game="battles" />
                <HomeGameElement game="crash" />
                <HomeGameElement game="duels" />
                <HomeGameElement game="roll" />
                <HomeGameElement game="cases" />
                <HomeGameElement game="blackjack" />
                <HomeGameElement game="mines" />
                <HomeGameElement game="towers" />
            </div>
        </div>

        <div class="home-games">
            <div class="games-title">BETS</div>
            <div class="games-content">
            </div>
        </div>

        <HomeDepositMethods />
        <Bets />
    </div>
</template>

<script>
    import Bets from '@/components/bets/Bets';
    import HomeBannerUser from '@/components/home/HomeBannerUser';
    import HomeBannerNews from '@/components/home/HomeBannerNews'
    import HomeFeaturedLink from '@/components/home/HomeFeaturedLink';
    import HomeGameElement from '@/components/home/HomeGameElement';
    import HomePlaceholderElement from '@/components/home/HomePlaceholderElement';
    import HomeDepositMethods from '@/components/home/HomeDepositMethods';

    export default {
        name: 'Home',
        metaInfo: {
            title: 'STARFLIP.GG Gambling'
        },
        components: {
            Bets,
            HomeBannerUser,
            HomeBannerNews,
            HomeFeaturedLink,
            HomeGameElement,
            HomePlaceholderElement,
            HomeDepositMethods
        }
    }
</script>

<style scoped>
    .home {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px 10px;
    }

    .home .home-banner {
        width: 1250px;
        display: flex;
        flex-wrap: wrap;
    }

    .home .home-featured,
    .home .home-games {
        width: 1250px;
        position: relative;
        padding: 70px 0;
    }

    .home .home-featured {
        margin-top: 55px;
    }

    .home .home-games {
        padding: 0px 0 40px 0;
    }

    .home .home-featured::before,
    .home .home-games::before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, rgba(2, 25, 44, 0) 0%,rgb(0, 187, 255) 50%, rgba(2, 25, 44, 0) 100%);
        z-index: -1;
    }

    .home .home-games::before {
        background: linear-gradient(90deg, rgba(2, 25, 44, 0) 0%, #3b7eb7 50%, rgba(2, 25, 44, 0) 100%);
    }

    .home .featured-title,
    .home .games-title {
        width: 205px;
        height: 43px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        /* font-family: 'Rubik'; */
        font-size: 24px;
        font-weight: 900;
        color: #ffffff;
    }

    .home .featured-title::before,
    .home .games-title::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(255deg,rgb(0, 76, 255) -25%,rgb(0, 159, 170) 100%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    .home .games-title::before {
        background: linear-gradient(255deg, #3b7eb7 -25%, #145081 100%);
    }

    .home .featured-content,
    .home .games-content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }

    @media only screen and (max-width: 1600px) {

        .home .home-banner,
        .home .home-featured,
        .home .home-games {
            width: 100%;
        }

    }

    @media only screen and (max-width: 950px) {

        .home {
            padding: 25px 10px 443px 10px;
        }

    }
</style>
