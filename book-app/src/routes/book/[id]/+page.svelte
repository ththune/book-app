<script>
	import { onMount } from 'svelte';
	import { bookEditDetailsStore } from '$lib/bookEditDetailsStore';
	import BackButton from '$lib/BackButton.svelte';

	export let data;

	let errorMessage = '';

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
		// Clear error message
		errorMessage = '';

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
			errorMessage = `Failed to delete ${book.bookTitle}`
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

	<p>ISBN {book.bookIsbn}</p>
	<p>Published on {book.bookPublishedDate}</p>

	{#if book.authors && book.authors.length > 0}
		<div class="authors-row">
			<p>
				Authored by {book.authors
					.map((author) => `${author.authorFirstName} ${author.authorLastName}`)
					.join(', ')}
			</p>
		</div>
	{/if}

	<a href="/edit-book" on:click={handleEditButton}>Edit book</a>
	<a on:click={handleDeleteButton} style="color: red">Delete book</a>
{/if}

{#if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}

<style>
	.authors-row {
		display: flex; /* Use flexbox to align items */
		align-items: center; /* Center-align items vertically */
	}
	.authors-row p {
		margin-right: 10px; /* Optional: Adds space between "Authored by" and authors */
	}
</style>
