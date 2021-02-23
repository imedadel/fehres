import { getBookmarksList } from "../utils/getBookmarksList"
import { metaFetcher } from "../utils/metaFetcher"
import Fuse from "fuse.js"

let fuse

async function initFuse() {
	const index = Object.values(await browser.storage.local.get(null))

	const options = {
		// isCaseSensitive: false,
		includeScore: false,
		// shouldSort: true,
		// includeMatches: false,
		// findAllMatches: false,
		// minMatchCharLength: 1,
		// location: 0,
		// threshold: 0.6,
		// distance: 100,
		useExtendedSearch: true,
		// ignoreLocation: false,
		// ignoreFieldNorm: false,
		keys: [
			{
				name: "title",
				weight: 1,
			},
			{
				name: "url",
				weight: 0.6,
			},
			{
				name: "description",
				weight: 0.8,
			},
		],
	}

	if (fuse) {
		fuse.setCollection(index)
	} else {
		fuse = new Fuse(index, options)
	}
}

// browser.browserAction.onClicked.addListener(async () => {
// 	console.log("Clicked!")
// 	const viewTabUrl = browser.extension.getURL("./index.html")
// 	const tab = await browser.tabs.create({ url: viewTabUrl, active: true })
// 	console.log(tab)
// })

async function handleBookmarksUpdate(id, info) {
	const response = await metaFetcher(info.url)

	if (!response.error) {
		await browser.storage.local.set({
			[id]: {
				id,
				title: info.title,
				url: info.url,
				...(response.data || {}),
			},
		})

		await initFuse()
	}
}

async function handleBookmarksRemove(id, info) {
	await browser.storage.local.remove(id)
	await initFuse()
}

browser.bookmarks.onCreated.addListener(handleBookmarksUpdate)
browser.bookmarks.onChanged.addListener(handleBookmarksUpdate)
browser.bookmarks.onRemoved.addListener(handleBookmarksRemove)

browser.omnibox.setDefaultSuggestion({
	description: `Deep search in your bookmarks`,
})

browser.omnibox.onInputChanged.addListener(async (text, suggest) => {
	if (!fuse) {
		await initFuse()
	}

	const result = fuse.search(text)
	let suggestions = []

	for (const { item } of result) {
		suggestions.push({
			content: item.url,
			description: item.title || item.description || item.url,
		})
	}

	suggest(suggestions)
})

browser.omnibox.onInputEntered.addListener((url, disposition) => {
	switch (disposition) {
		case "currentTab":
			browser.tabs.update({ url })
			break
		case "newForegroundTab":
			browser.tabs.create({ url })
			break
		case "newBackgroundTab":
			browser.tabs.create({ url, active: false })
			break
	}
})

async function indexBookmarks() {
	await browser.storage.local.clear()
	const tree = await browser.bookmarks.getRecent(1)
	const index = await browser.storage.local.get(null)

	const keys = Object.keys(index)
	const isEmpty = keys.length === 0
	const isOutOfDate = index[tree[0].id] == null

	console.log({ isEmpty, isOutOfDate })
	if (isEmpty || isOutOfDate) {
		console.log("FEHRES: Indexing.")

		const bookmarks = (await getBookmarksList(new Set(keys))).slice(0, 100)
		let total = 0

		for (const bookmark of bookmarks) {
			++total
			console.log(
				`FEHRES: Indexed ${total} of ${bookmarks.length}. That's ${(total /
					bookmarks.length) *
					100}%`
			)
			const response = await metaFetcher(bookmark.url)

			if (!response.error) {
				await browser.storage.local
					.set({
						[bookmark.id]: {
							id: bookmark.id,
							title: bookmark.title,
							url: bookmark.url,
							...(response.data || {}),
						},
					})
					.catch((err) => {
						console.log("FEHRES: Error", err)
					})
			}
		}
	}

	await initFuse()

	console.log("FEHRES: Ready.")
}

indexBookmarks()
