<script>
	import { writable } from 'svelte/store';

	let title = '';
	let isbn = '';
	let publishedDate = '';

	let authorFirstName = '';
	let authorLastName = '';
	let authors = writable([]);

	// Add a new author to the local authors writable.
	function addAuthor() {
		if (authorFirstName.length === 0 || authorLastName.length === 0) {
			return;
		}

		authors.update((authors) => [...authors, { authorFirstName, authorLastName }]);
		authorFirstName = '';
		authorLastName = '';
	}

	// POST the new book to the API.
	async function postAuthor() {
		const response = await fetch('http://localhost:5086/Book', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				bookTitle: title,
				bookIsbn: isbn,
				bookPublishedDate: publishedDate,
				authors: $authors
			})
		});

		console.log(response.json());
	}
</script>

<svelte:head>
	<title>Add book</title>
	<meta name="description" content="Add book" />
</svelte:head>

<h1>Add a new book</h1>

<label for="title">Title</label>
<input
	bind:value={title}
	type="text"
	name="title"
	placeholder="Enter title"
	title="Please enter the title of the book"
/>

<label for="isbn">ISBN</label>
<input
	bind:value={isbn}
	type="text"
	name="isbn"
	placeholder="Enter valid ISBN number (10 or 13 digits)"
	pattern="^(97(8|9))?\d{9}(\d|X)$"
	title="Please enter a valid ISBN number (10 or 13 digits)"
/>

<label for="publishedDate">Published Date</label>
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
	{#each $authors as author}
		<li>{author.authorFirstName} {author.authorLastName}</li>
	{/each}
</ul>

<!-- <p>{title}</p> -->
<!-- <p>{isbn}</p> -->
<!-- <p>{publishedDate}</p> -->

<button type="submit" on:click={postAuthor}>Submit</button>
