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

	function formatDate(dateString) {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en', options);
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

			<div class="book-container">
				<a href="/book/{book.bookId}">
					<p class="book-title">{book.bookTitle}</p>
					<!-- <p class="book-published">Published {book.bookPublishedDate}</p> -->
					<p class="book-published">Published {formatDate(book.bookPublishedDate)}</p>
					<p class="book-isbn">ISBN {book.bookIsbn}</p>
				</a>
			</div>

			<!-- <div class="row">
					<p>{book.bookTitle}</p>
					<p>{book.bookIsbn}</p>
					<p>{book.bookPublishedDate}</p>
				</div> -->
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

	.book-container {
		max-width: 600px; /* Maximum width of the container */
		/* margin: 0 auto; Center the container horizontally */
		margin-bottom: 10px;
		padding: 20px;
		border: 1px solid #ccc; /* Optional border for visibility */
		background-color: #f9f9f9; /* Optional background color */
		border-radius: 5px; /* Optional rounded corners */
	}

	.book-title {
		font-size: 1.2em;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.book-info-row {
		display: flex;
		justify-content: space-between;
	}

	.book-isbn,
	.book-published {
		font-size: 1em;
		margin: 0; /* Remove default margin */
	}
</style>
