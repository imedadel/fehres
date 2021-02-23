/**
 *
 * @param {string} url The full URL to fetch
 */
export const metaFetcher = async (url) => {
	try {
		if (!url) {
			return { error: "Undefined url" }
		}

		if (!url.startsWith("http")) {
			return { error: "Unsupported protocol" }
		}

		const trimmedUrl = url.trim()
		const requestOptions = {
			method: "GET",
		}

		const response = await fetch(trimmedUrl, requestOptions)

		const contentType = response.headers.get("Content-Type").split(";")[0]

		if (contentType !== "text/html") {
			return { contentType }
		}

		const content = await response.text()
		const document = new DOMParser().parseFromString(content, contentType)

		const data = {
			url,
			title: document.querySelector("head > title")?.textContent ?? "",
			description:
				document
					.querySelector("head > meta[name=description]")
					?.getAttribute("content") ?? "",
			// body: document.body.textContent
			// 	.replace(/\n|\r|\t|/g, "")
			// 	.replace(/\s+/g, " "),
		}

		return { contentType, data }
	} catch (error) {
		console.log(error)
		return { error }
	}
}
