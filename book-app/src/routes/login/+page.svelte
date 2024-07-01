<script>
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let errorMessage = '';

	async function login() {
		errorMessage = '';
		const response = await fetch('http://localhost:5086/Auth/SignIn', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: username, password: password })
		});

		if (response.ok) {
			sessionStorage.setItem('loggedIn', true);
			goto('/');
		} else {
			errorMessage = 'Login failed';
		}
	}
</script>

<form on:submit={login}>
	<div>
		<label for="username">Username:</label>
		<input type="username" id="username" bind:value={username} required />
	</div>
	<div>
		<label for="password">Password:</label>
		<input type="password" id="password" bind:value={password} required />
	</div>

	<button type="submit">Login</button>
</form>

{#if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}
