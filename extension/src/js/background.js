import browser from "webextension-polyfill"
import "../img/icon-128.png"

browser.browserAction.onClicked.addListener(async () => {
	console.log("Clicked!")
	const viewTabUrl = browser.extension.getURL("fehres.html")
	const tab = await browser.tabs.create({ url: viewTabUrl, active: true })
	console.log(tab)
})
