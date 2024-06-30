import { writable } from 'svelte/store';

const book = {
    id: 0,
	title: '',
	isbn: '',
	publishedDate: '',
	authors: []
};

export const bookEditDetailsStore = writable(book);
