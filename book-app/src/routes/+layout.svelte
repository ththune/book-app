<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import Header from './Header.svelte';
	import './styles.css';
	import NotFound from '$lib/NotFound.svelte';
	import { onMount } from 'svelte';

	export let status;

	const errorPages = {
		404: NotFound
	};

	onMount(() => {
		const loggedIn = sessionStorage.getItem('loggedIn');
		if (!loggedIn) {
			goto('/login');
		}
	});
</script>

<div class="app">
	{#if $page.url.pathname !== '/login'}
		<Header />
	{/if}

	<main>
		{#if status in errorPages}
			<svelte:component this={errorPages[status]} />
		{:else}
			<slot />
		{/if}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
