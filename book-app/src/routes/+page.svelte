<script>
	import { onMount } from 'svelte';

	let data;
	let books;

	async function getBooks() {
		const response = await fetch('http://localhost:5086/Book', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		books = await response.json();
	}

	onMount(async () => {
		await getBooks();
	});
</script>

<h1>The Book App</h1>
<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Home" />
</svelte:head>

<div class="text-column">
	<!-- <h1>Get som data here from an API</h1> -->

	<!-- <button on:click={getBooks}>Get books</button> -->
	{#if books}
		{#each books as book (book.bookId)}
			<!-- <a class="how-to-play" href="/sverdle/how-to-play">How to play</a> -->

			<a class="book" href="/book/{book.bookId}">
				<div class="row">
					<p>{book.bookId}</p>
					<p>{book.bookTitle}</p>
					<p>{book.bookIsbn}</p>
					<p>{book.bookPublishedDate}</p>
				</div>
			</a>
		{/each}
	{/if}
</div>

<style>
	.row {
		display: flex;
		gap: 10px;
	}

	.row p {
		margin: 0;
	}
</style>
