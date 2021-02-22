import * as memory from "./memory"
import browser from "webextension-polyfill"
import ky from "ky"

async function getQuestionDetails({
	action = `questionTitle`,
	isProblem = false,
	tabId,
}) {
	if (!isProblem) return {}

	const questionDetails = await browser.tabs.sendMessage(tabId, {
		action,
	})

	return questionDetails
}

async function getActiveTab() {
	const allTabs = await browser.tabs.query({
		active: true,
		currentWindow: true,
	})

	return allTabs[0]
}

function getProblemLink(activeTab) {
	let urlLocation = document.createElement(`a`)
	urlLocation.href = activeTab.url

	return urlLocation
}

function checkIfProblem(pathname) {
	return (
		/\/problems\/\w+/g.test(pathname) && !/\/discuss\/[\w\W]*/g.test(pathname)
	)
}

function checkIfExplore(pathname) {
	return /\/explore\/\w+/g.test(pathname) && /(\d+(\/|))$/g.test(pathname)
}

export async function getDetails(action) {
	const activeTab = await getActiveTab()
	const isProblem =
		checkIfProblem(getProblemLink(activeTab).pathname) ||
		checkIfExplore(getProblemLink(activeTab).pathname)
	const detail = await getQuestionDetails({
		action,
		isProblem,
		tabId: activeTab.id,
	})

	return detail
}

async function specificDetails(type) {
	if (type === "problem") {
		const questionDetails = await getDetails(`questionTitle`)
		const questionId = questionDetails.split(".")[0]
		const questionTitle = questionDetails.split(".")[1]
		const questionLevel = await getDetails(`questionLevel`)
		const fullQuestionLink = getProblemLink(await getActiveTab()).href

		// Trim the question link
		const questionLink = /(http(?:s|):\/\/(?:www.|)leetcode.com\/problems\/[\w-]+\/)/.exec(
			fullQuestionLink
		)[1]

		return {
			questionId,
			questionTitle,
			questionLevel,
			questionLink,
		}
	} else {
		const questionTitle = await getDetails(`questionExploreTitle`)
		const questionLink = getProblemLink(await getActiveTab()).href
		const questionId = "explore" + questionLink.match(/[\w\W]+\/(\d+)\//)[1]
		const questionLevel = null

		return {
			questionId,
			questionTitle,
			questionLevel,
			questionLink,
		}
	}
}

/**
 * Event handler for bad rating
 */
export async function handleBadRating() {
	const type = await pageType()
	const {
		questionId,
		questionTitle,
		questionLevel,
		questionLink,
	} = await specificDetails(type)

	const oldQuestionData = await browser.storage.local.get(questionId)
	const { newDueDate, multiplier } =
		!!oldQuestionData && !!oldQuestionData[questionId]
			? memory.getNewDueDate(
					memory.RATINGS.bad,
					oldQuestionData[questionId].timeInterval
			  )
			: memory.getNewDueDate(memory.RATINGS.bad)

	// Add new date to local storage
	await browser.storage.local.set({
		[questionId]: {
			easeFactor: 2.5,
			timeInterval: multiplier,
			dueDate: newDueDate,
			title: questionTitle,
			level: questionLevel,
			link: questionLink,
			type,
		},
	})
}

/**
 * Event handler for good rating
 */
export async function handleGoodRating() {
	const type = await pageType()
	const {
		questionId,
		questionTitle,
		questionLevel,
		questionLink,
	} = await specificDetails(type)

	const oldQuestionData = await browser.storage.local.get(questionId)
	const { newDueDate, multiplier } =
		!!oldQuestionData && !!oldQuestionData[questionId]
			? memory.getNewDueDate(
					memory.RATINGS.good,
					oldQuestionData[questionId].timeInterval
			  )
			: memory.getNewDueDate(memory.RATINGS.good)

	// Add new date to local storage
	await browser.storage.local.set({
		[questionId]: {
			easeFactor: 2.5,
			timeInterval: multiplier,
			dueDate: newDueDate,
			title: questionTitle,
			level: questionLevel,
			link: questionLink,
			type,
		},
	})
}

/**
 * Check if current page is a problem page
 */
export async function isProblemPage() {
	return checkIfProblem(getProblemLink(await getActiveTab()).pathname)
}

export async function pageType() {
	const pageLink = getProblemLink(await getActiveTab()).pathname

	if (checkIfProblem(pageLink)) {
		return "problem"
	}

	if (checkIfExplore(pageLink)) {
		return "explore"
	}

	return "other"
}

/**
 * Check if current page is an explore card
 */
export async function isExplorePage() {
	return checkIfExplore(getProblemLink(await getActiveTab()).pathname)
}

/**
 * Returns a list of problems due for today
 */
export async function getProblemsList() {
	const fullProblems = await browser.storage.local.get(null)
	const { userInfo, ...allProblems } = fullProblems

	const filteredList = Object.entries(allProblems).filter(
		([problemId, problemDetails]) => {
			return (
				memory.checkIfBefore(problemDetails.dueDate) &&
				problemDetails.type !== "explore"
			)
		}
	)

	return filteredList
}

/**
 * Returns a list of explore cards due for today
 */
export async function getExploreList() {
	const fullProblems = await browser.storage.local.get(null)
	const { userInfo, ...allProblems } = fullProblems

	const filteredList = Object.entries(allProblems).filter(
		([problemId, problemDetails]) => {
			return (
				memory.checkIfBefore(problemDetails.dueDate) &&
				problemDetails.type === "explore"
			)
		}
	)

	return filteredList
}

export async function getHistory() {
	return await browser.storage.local.get(null)
}

export async function setHistory(userHistory) {
	await browser.storage.local.set(userHistory)
}

export async function lookForUserInfo() {
	const { userInfo } = await browser.storage.sync.get("userInfo")
	return userInfo
}

export async function rememberUser(email) {
	await browser.storage.sync.set({
		userInfo: {
			email: email,
		},
	})
}

export async function checkIfPaidPaddle(email = "") {
	if (!email) return false

	const transactions = await ky
		.post("https://spacedleet.vercel.app/api/check", {
			json: {
				email: email,
			},
		})
		.json()

	return transactions.hasPaid
}
