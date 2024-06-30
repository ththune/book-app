<script>
	import { onMount } from 'svelte';
	import { bookEditDetailsStore } from '$lib/bookEditDetailsStore';
	import BackButton from '$lib/BackButton.svelte';

	export let data;

	let book;

	async function getBook() {
		try {
			const response = await fetch(`http://localhost:5086/Book/${data.id}`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Error:, ${response.status}`);
			}

			book = await response.json();
		} catch (error) {
			console.error(`Error: ${error.message}`);
		}
	}

	async function deleteBook() {
		try {
			const response = await fetch(`http://localhost:5086/Book/${data.id}`, {
				method: 'DELETE',
				headers: {
					'content-type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Error:', 'response.status');
			}

			// Navigate back to the previous page after a succesful book deletion.
			history.back();
			
		} catch (error) {
			console.error('Error: ', error.message);
		}
	}

	onMount(async () => {
		await getBook();
	});

	function handleEditButton() {
		bookEditDetailsStore.set({
			id: book.bookId,
			title: book.bookTitle,
			isbn: book.bookIsbn,
			publishedDate: book.bookPublishedDate,
			authors: book.authors
		});
	}

	async function handleDeleteButton() {
		let choice = confirm('Do you want to delete the book?');

		if (choice) {
			await deleteBook();
		}
	}
</script>

<svelte:head>
	<title>{book?.bookTitle ?? 'Book details'}</title>
	<meta name="description" content="Book details" />
</svelte:head>

{#if book}
	<h1>{book.bookTitle}</h1>

	<BackButton />

	<p>{book.bookIsbn}</p>
	<p>{book.bookPublishedDate}</p>

	{#if book.authors && book.authors.length > 0}
		<p>Authored by</p>
		{#each book.authors as author (author.authorId)}
			<p>{author.authorFirstName} {author.authorLastName}</p>
		{/each}
	{/if}

	<a href="/edit-book" on:click={handleEditButton}>Edit book</a>
	<a on:click={handleDeleteButton} style="color: red">Delete book</a>
{/if}
