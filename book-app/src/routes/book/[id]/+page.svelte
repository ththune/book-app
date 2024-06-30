<script>
	import { onMount } from 'svelte';
	import { bookEditDetailsStore } from '$lib/bookEditDetailsStore';

	export let data;

	let book;

	async function getBookData() {
		try {
			const response = await fetch(`http://localhost:5086/Book/${data.id}`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Error:', 'response.status');
			}

			book = await response.json();

			console.log(book);
		} catch (error) {
			console.error('Error: ', error.message);
		}
	}

	onMount(async () => {
		await getBookData();
	});
</script>

<svelte:head>
	<title>{book?.bookTitle ?? 'Book details'}</title>
	<meta name="description" content="Book details" />
</svelte:head>

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

	<a
		href="/edit-book"
		on:click={() => {
			bookEditDetailsStore.set({
				id: book.bookId,
				title: book.bookTitle,
				isbn: book.bookIsbn,
				publishedDate: book.bookPublishedDate,
				authors: book.authors
			});
		}}>Edit book</a
	>
	<a on:click={() => {}} style="color: red">Delete book</a>
{/if}
