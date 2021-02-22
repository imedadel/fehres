import browser from "webextension-polyfill"

browser.runtime.onMessage.addListener((message, sender) => {
	if (message.action === `questionTitle`) {
		return Promise.resolve(
			document.querySelector('[data-cy="question-title"]').innerText.trim()
		)
	}

	if (message.action === `questionExploreTitle`) {
		return Promise.resolve(
			!!document.querySelector(".question-title")
				? document.querySelector(".question-title").innerText.trim()
				: document.querySelector(".content-title").innerText.trim()
		)
	}

	if (message.action === `questionLevel`) {
		return Promise.resolve(document.querySelector("[diff]").innerText)
	}

	if (message.action === `questionId`) {
		return Promise.resolve(
			document
				.querySelector('[data-cy="question-title"]')
				.innerText.split(".")[0]
		)
	}

	return Promise.resolve(null)
})
