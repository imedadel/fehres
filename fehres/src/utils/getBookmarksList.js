/**
 *
 * @param {Set<string>} omittedIds
 */
export const getBookmarksList = async (omittedIds) => {
	const tree = await browser.bookmarks.getTree()
	let items = [...tree]
	for (const item of items) {
		if (item.children) {
			for (const child of item.children) {
				if (!omittedIds.has(child.id)) {
					items.push(child)
				}
			}
		}
	}

	return items.sort((a, b) => b.dateAdded - a.dateAdded)
}
