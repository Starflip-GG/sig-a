<template>
    <div class="modal-faq">
        <div class="faq-header">
            <span class="gradient-green">QUESTIONS AND ANSWERS</span>
            <p>Here are some answers to frequently asked questions we have collected for you. New content is added on 
            a regular basis to help you quickly overcome any difficulties. Of course you can also contact our support 
            or ask questions directly in our Discord.</p>
        </div>
        <div class="faq-list">

            <FaqElement title="What is STARFLIP?" text="STARFLIP is a virtual arcade designed for players to multiply their RBX or Limiteds! We are the most innovative arcade, striving to bring you the best gaming experiences." />
            <FaqElement title="Why do you need my Roblox credentials?" text="To automate our deposit and withdrawal system, we utilize a P2P system to facilitate seamless transactions for depositors and withdrawers. STARFLIP ensures user security and does not store your password. If you feel unsafe with us having your credentials, you can invalidate them anytime by changing your password." />
            <FaqElement title="What are the coins?" text="Your balance is displayed as coins, which have a conversion rate of 1 coin to 1 RBX. You can withdraw these coins to your account at a 1-to-1 rate." />
            <FaqElement title="Can I transfer coins to another account?" text="Yes, you can transfer coins to another account by simply clicking on a user's profile and selecting the Tip User button." />
            <FaqElement title="I am missing coins, what now?" text="Ensure you've not shared access to your STARFLIP account. If your account is compromised, we will assist you in regaining access. However, we do not issue balance adjustments to compensate for losses as account security is your responsibility. If this involves a system issue, please open a ticket in our Discord." />
            <FaqElement title="I deposited with cryptocurrency and have not received my deposit." text="If you haven’t received your deposit after 3 confirmations, please open a ticket in our Discord with the transaction details." />
            <FaqElement title="I discovered a vulnerability or exploit. What should I do?" text="Join our Discord and create a ticket to report the issue. You will be rewarded for reporting any vulnerability or exploit." />
            <FaqElement title="What is 'Rain Abuse'?" text="Rain coins distributed via the 30-minute rain feature are intended to be used on games provided on our site. Saving up free rain coins over time or not using them to participate genuinely is considered rain abuse and will result in a permanent ban. Please note, rain bans are not reversible." />
            <FaqElement title="How much commission do I get when my referrals place a bet?" text="You receive 1% of every wager placed by your referrals. For example, if someone wagers 1,000,000 coins, you would earn 10,000 coins." />
            <FaqElement title="How does the deposit and withdrawal system work?" text="We use a Peer-to-Peer (P2P) system to facilitate transactions. There may be extended wait times for limited or RBX deposits. Deposits require someone to withdraw and vice versa. STARFLIP subsidizes long queue times to ensure user satisfaction." />
            <FaqElement title="Is there a maximum bet or profit?" text="Yes, each game has specific maximum bet and profit limits per round. You can find these details in each game." />
            <FaqElement title="What happens if my internet disconnects during a Crash round?" text="Our auto-cashout feature ensures your bet is handled properly, even if you disconnect. We recommend using this feature if you have unreliable internet." />
            <FaqElement title="Does the Crash game have a maximum multiplier?" text="Our Crash game has no multiplier limit! However, you will be automatically cashed out if you hit the maximum profit limit." />
            <FaqElement title="How do I know that STARFLIP is fair and doesn't rig results?" text="STARFLIP is a provably fair arcade. You can verify all game results using our provably fair system available at the bottom of our website." />
            <FaqElement title="Can I make money by promoting the website?" text="If you're an influencer looking for sponsorship opportunities, please join our Discord server and open a ticket. You can link your Discord in the 'Settings' page of your profile." />

        </div>
    </div>
</template>

<script>
    import FaqElement from '@/components/faq/FaqElement';

    export default {
        name: 'ModalFaq',
        components: {
            FaqElement
        }
    }
</script>

<style scoped>
    .modal-faq {
        width: 1000px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 30px 0 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-faq .faq-header {
        width: 100%;
        padding-bottom: 30px;
        border-bottom: 1px solid #335361;
    }

    .modal-faq .faq-header span  {
        font-size: 32px;
        font-weight: 900;
    }

    .modal-faq .faq-header p  {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-faq .faq-list {
        width: 100%;
        height: 600px;
        padding: 30px 10px 30px 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-faq .faq-list::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .modal-faq .faq-list::-webkit-scrollbar-track {
        margin: 30px 0;
        background-color: #062234;
    }

    .modal-faq .faq-list::-webkit-scrollbar-thumb {
        background-color: #1e5164;
    }

    @media only screen and (max-width: 1190px) {

        .modal-faq {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 700px) {

        .modal-faq {
            padding: 80px 15px 0 15px;
        }

    }
</style>
