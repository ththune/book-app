<script>
	import { onMount } from 'svelte';

	export let data;

	let book;

	async function getBookData() {
		const response = await fetch(`http://localhost:5086/Book/${data.id}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		book = await response.json();

		console.log(book);
	}

	onMount(async () => {
		await getBookData();
	});
</script>

<!-- <p>Book id page</p> -->

{#if book}
	<h1>{book.bookTitle}</h1>
	<p>{book.bookIsbn}</p>
	<p>{book.bookPublishedDate}</p>

	{#if book.authors && book.authors.length > 0}
		<p>Authored by</p>
		{#each book.authors as author (author.authorId)}
			<p>{author.authorFirstName} {author.authorLastName}</p>
		{/each}
	{/if}
{/if}
