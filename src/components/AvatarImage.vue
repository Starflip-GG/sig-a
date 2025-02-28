<template>
    <div class="avatar-image">
        <img :src="avatarImage" @error="avatarImageError()" alt="avatar" />
    </div>
</template>

<script>
export default {
    name: 'AvatarImage',
    props: ['image'],
    data() {
        return {
            avatarImage: null,
            serverUrl: process.env.VUE_APP_BACKEND_URL,
            fallbackUrl: "/api/public/img/avatar/1.webp", // Default fallback URL
        };
    },
    methods: {
        avatarImageError() {
            console.warn(`Failed to load avatar image: ${this.avatarImage}. Using fallback.`);
            this.avatarImage = this.fallbackUrl; // Set fallback URL on error
        },
    },
    created() {
        if (this.image && this.image.startsWith("https://cdn.discordapp.com")) {
            // Discord avatars are used directly
            this.avatarImage = this.image;

        } else if (this.image && this.image.startsWith("https://tr.rbxcdn.com")) {
            // Discord avatars are used directly
            this.avatarImage = this.image;

        } else if (this.image) {
            // Combine custom image with the server URL
            this.avatarImage = `${this.serverUrl}${this.image}`;
        } else {
            // Use fallback if no image is provided
            this.avatarImage = this.fallbackUrl;
        }
    },
};
</script>

<style scoped>
.avatar-image {
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 100%;
}

.avatar-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
