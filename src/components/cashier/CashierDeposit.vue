<template>
    <div class="cashier-deposit">

        <div class="deposit-section">
            <div class="section-title">STARFLIP.GG</div>

            <CashierElement v-on:click.native="modalCreditButton()" type="" method="credit" v-bind:enabled="generalSettings.credit.deposit.enabled" />
            <CashierElement v-on:click.native="modalRobuxButton()" type="roblox" method="robux" v-bind:enabled="generalSettings.robux.deposit.enabled" />
            <CashierElement v-on:click.native="modalLimitedsButton()" type="roblox" method="limiteds" v-bind:enabled="generalSettings.limited.deposit.enabled" />
            <CashierElement v-on:click.native="modalSteamButton('csgo')" type="skinify" method="csgo" v-bind:enabled="generalSettings.steam.deposit.enabled" />
            <CashierElement v-on:click.native="modalSteamButton('dota2')" type="skinify" method="dota" v-bind:enabled="generalSettings.steam.deposit.enabled" />
            
        </div>
        <div class="deposit-section">
            <div class="section-title">Crypto</div>
            <CashierElement v-on:click.native="modalCryptoButton('btc')" type="crypto" method="btc" v-bind:enabled="generalSettings.crypto.deposit.enabled" />
            <CashierElement v-on:click.native="modalCryptoButton('eth')" type="crypto" method="eth" v-bind:enabled="generalSettings.crypto.deposit.enabled" />
            <CashierElement v-on:click.native="modalCryptoButton('ltc')" type="crypto" method="ltc" v-bind:enabled="generalSettings.crypto.deposit.enabled" />
        </div>
        <div class="deposit-section">
            
            <div class="section-gift">
                <div class="gift-title">Redeem Bonus Code</div>
                <div class="gift-input">
                    <input v-model="modalGiftCode" type="text" placeholder="XXXX-XXXX-XXXX-XXXX" />
                    <button v-on:click="modalRedeemButton()" class="button-redeem" v-bind:disabled="socketSendLoading !== null">
                        <div class="button-inner">REDEEM</div>
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import CashierElement from '@/components/cashier/CashierElement';

    export default {
        name: 'CashierDeposit',
        components: {
            CashierElement
        },
        data() {
            return {
                modalGiftCode: null
            }
        },
        methods: {
            ...mapActions([
                'notificationShow',
                'modalsSetShow', 
                'modalsSetData'
            ]),
            modalRobuxButton() {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'deposit' });

                setTimeout(() => { this.modalsSetShow('Robux'); }, 200);
            },
            modalLimitedsButton() {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'deposit' });

                this.$router.push({ name: 'LimitedsDeposit' });
            },
            modalSteamButton(game) {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'deposit', provider: 'skinify', game: game });

                setTimeout(() => { this.modalsSetShow('Proceed'); }, 200);
            },
            modalCreditButton() {
                window.open('https://starflip.sell.app', '_blank');
            },
            modalCryptoButton(currency) {
                window.open('https://starflip.sell.app', '_blank');
            },
            modalGiftButton(provider) {
                this.modalsSetShow(null);
                this.modalsSetData({ typeCashier: 'deposit', provider: provider });

                setTimeout(() => { this.modalsSetShow('Gift'); }, 200);
            },
            modalRedeemButton() {
                if(this.modalGiftCode === null || this.modalGiftCode.trim() === '') {
                    this.notificationShow({ type: 'error', message: 'Your entered gift code is invalid.' });
                    return;
                }

                this.modalsSetShow(null);

                setTimeout(() => {
                    this.modalsSetData({ typeCaptcha: 'giftRedeem', data: { code: this.modalGiftCode.replaceAll('-', '') } });
                    this.modalsSetShow('Captcha');
                }, 200);
            }
        },
        computed: {
            ...mapGetters([
                'generalSettings',
                'socketSendLoading'
            ])
        }
    }
</script>

<style scoped>
    .cashier-deposit {
        width: 100%;
    }

    .cashier-deposit .deposit-section {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 25px;
    }

    .cashier-deposit .section-title {
        width: 100%;
        font-size: 14px;
        font-weight: 700;
        color: #5191b1;
    }

    .cashier-deposit .section-gift {
        width: calc(50% - 18px);
        margin-left: 12px;
    }

    .cashier-deposit .gift-title {
        font-size: 13px;
        font-weight: 400;
        color: #5191b1;
    }

    .cashier-deposit .gift-input {
        width: 100%;
        height: 64px;
        position: relative;
        margin-top: 7px;
    }

    .cashier-deposit .gift-input input {
        width: 100%;
        height: 100%;
        padding: 0 115px 0 20px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 400;
        color: #ffffff;
        background: #072131;
        border: 1px dashed #123651;
    }

    .cashier-deposit .gift-input input::placeholder {
        color: #bbbfd0;
    }

    .cashier-deposit button.button-redeem {
        width: 95px;
        height: 36px;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translate(0, -50%);
        transition: all .2s;
    }

    .button-redeem:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .button-redeem:active {
        transition-duration: .2s;
        scale: .9;
    }

    .cashier-deposit button.button-redeem .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(255deg,rgb(0, 157, 255) 0%,rgb(0, 9, 170) 100%);
        clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 25%, 100% 75%, calc(100% - 5px) 100%, 5px 100%, 0 75%, 0 25%);
    }

    @media only screen and (max-width: 840px) {

        .cashier-deposit .section-gift {
            width: calc(33.33% - 8px);
            margin-left: 0;
        }

    }

    @media only screen and (max-width: 840px) {

        .cashier-deposit .section-gift {
            width: 100%;
            margin-top: 12px;
            margin-left: 0;
        }

    }
</style>
