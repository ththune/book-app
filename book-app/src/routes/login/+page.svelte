<script>
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let errorMessage = '';
	let isLoggingIn = false;

	async function login() {
		errorMessage = '';
		isLoggingIn = true;

		try {
			const response = await fetch('http://localhost:5086/Auth/SignIn', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username, password: password })
			});

			if (!response.ok) {
				throw new Error('Login failed');
			}

			let data = await response.json();

			if (data.signedIn) {
				sessionStorage.setItem('loggedIn', true);
				goto('/');
			}
		} catch (error) {
			errorMessage = error;
		}

		isLoggingIn = false;
	}
</script>

<p>prod?</p>
<div class="container">
	<form class="center-form" on:submit={login}>
		<div>
			<label for="username">Username:</label>
			<input type="username" id="username" bind:value={username} required />
		</div>
		<div>
			<label for="password">Password:</label>
			<input type="password" id="password" bind:value={password} required />
		</div>

		{#if !isLoggingIn}
			<button class="submit-button" type="submit">Login</button>
		{:else}
			<p>Please wait...</p>
		{/if}

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
	</form>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 30vh;
		width: 20vw;
		max-width: 600px;
		margin: auto auto;
	}

	.center-form {
		background-color: #f2f2f2;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}

	.center-form label {
		display: block;
		margin-bottom: 5px;
	}

	.submit-button {
		display: block;
		margin-top: 10px;
	}
</style>
