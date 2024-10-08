<script>
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { bookEditDetailsStore } from '$lib/bookEditDetailsStore';
	import BackButton from '$lib/BackButton.svelte';

	let successMessage = '';
	let errorMessage = '';

	let id;
	let title = '';
	let isbn = '';
	let publishedDate = '';

	let authorFirstName = '';
	let authorLastName = '';

	let oldAuthors = [];
	let authors = writable([]);
	$: allAuthors = oldAuthors.concat($authors);

	let bookEditDetails = {
		title: '',
		isbn: '',
		publishedDate: '',
		authors: []
	};

	// Retrieve the edit book details from the previous page, via store
	const unsubscribe = bookEditDetailsStore.subscribe((value) => {
		bookEditDetails = value;
	});

	onMount(() => {
		return unsubscribe;
	});

	onMount(() => {
		console.log('Editing book:', bookEditDetails);
		id = bookEditDetails.id;
		title = bookEditDetails.title;
		isbn = bookEditDetails.isbn;
		publishedDate = bookEditDetails.publishedDate;
		oldAuthors = bookEditDetails.authors;
		// authors.set(bookEditDetails.authors);
	});

	// Add a new author to the local authors writable.
	function addAuthor() {
		if (authorFirstName.length === 0 || authorLastName.length === 0) {
			return;
		}

		authors.update((authors) => [...authors, { authorFirstName, authorLastName }]);
		authorFirstName = '';
		authorLastName = '';
	}

	// PUT the new book to the API.
	async function putBookWithAuthors() {
		// Reset messages
		successMessage = '';
		errorMessage = '';

		// Check that input variables are provided before posting to the API.
		if (title.length === 0) {
			errorMessage = 'Title is missing';
			return;
		}

		if (isbn.length === 0) {
			errorMessage = 'ISBN is missing';
			return;
		}

		if (publishedDate.length === 0) {
			errorMessage = 'Published Date is missing';
			return;
		}

		const response = await fetch(`http://localhost:5086/Book/${id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				bookTitle: title,
				bookIsbn: isbn,
				bookPublishedDate: publishedDate
			})
		});

		if (response.ok) {
			successMessage = `${title} was updated!`;
		} else {
			throw new Error(`Error: ${response.status}`);
		}

		const data = await response.json();

		if (data.bookId && $authors.length > 0) {
			let authorsBody = [];
			$authors.forEach((author, index) => {
				authorsBody.push({
					authorFirstName: author.authorFirstName,
					authorLastName: author.authorLastName
				});
			});

			const response = await fetch(`http://localhost:5086/Author/Book/${data.bookId}`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(authorsBody)
			});

			if (!response.ok) {
				throw new Error(`Error:, ${response.status}`);
			}
		}
	}
</script>

<svelte:head>
	<title>Edit book</title>
	<meta name="description" content="Edit book" />
</svelte:head>

<h1>Edit book page</h1>

<BackButton />

<label for="title">Title*</label>
<input
	bind:value={title}
	type="text"
	name="title"
	placeholder="Enter title"
	title="Please enter the title of the book"
/>

<label for="isbn">ISBN*</label>
<input
	bind:value={isbn}
	type="text"
	name="isbn"
	placeholder="Enter valid ISBN number (10 or 13 digits)"
	pattern="^(97(8|9))?\d{9}(\d|X)$"
	title="Please enter a valid ISBN number (10 or 13 digits)"
/>

<label for="publishedDate">Published Date*</label>
<input
	bind:value={publishedDate}
	type="text"
	name="publishedDate"
	placeholder="YYYY-MM-DD"
	title="Enter a published date for the book (YYYY-MM-DD)"
/>

<label for="authors">Authors</label>
<input
	bind:value={authorFirstName}
	type="text"
	name="authorFirstName"
	placeholder="Firstname"
	title="Enter the firstname of the author"
/>
<input
	bind:value={authorLastName}
	type="text"
	name="authorLastName"
	placeholder="Lastname"
	title="Enter the lastname of the author"
/>
<button type="button" on:click={addAuthor}>Add author</button>

<ul>
	{#each allAuthors as author}
		<li>{author.authorFirstName} {author.authorLastName}</li>
	{/each}
</ul>

<button type="submit" on:click={putBookWithAuthors}>Submit</button>

{#if successMessage}
	<p class="success">{successMessage}</p>
{:else if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}

<style>
	label {
		margin-top: 10px;
	}
</style>
