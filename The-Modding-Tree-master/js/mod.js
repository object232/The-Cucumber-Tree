let modInfo = {
	name: "The Cucumber Tree",
	author: "Object232",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.01",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.01</h3><br>
		- Added things.<br>
		- Added stuff.<br>
		- 猎奇群友别发屎了`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(1)
if (hasUpgrade('c', 11)) gain = gain.times(2)
	if (hasUpgrade('c', 14)) gain = gain.times(5)
if (hasUpgrade('c', 12)) {
	let logBase = hasUpgrade('m', 11) ? 2 : 5
	gain = gain.times(new Decimal(1).add(player.c.points.add(1).log(logBase)))
}
	if (hasUpgrade('c', 15)) gain = gain.times(6)
	if (hasUpgrade('c', 35)) gain = gain.times(5e14)
	if (hasUpgrade('c', 41)) gain = gain.times(1e20)
	if (hasUpgrade('c', 41)) gain = gain.times(6e15)
	if (hasUpgrade('m', 21)) gain = gain.times(1000000)
	if (hasUpgrade('m', 23)) gain = gain.times(1000000)
	if (hasUpgrade('u', 11)) gain = gain.times(10000000)
	if (hasUpgrade('u', 12)) gain = gain.times(1000000)
	if (hasUpgrade('u', 15)) gain = gain.times(2.22e22)
	if (hasUpgrade('u', 22)) gain = gain.times(1e33)
	if (hasUpgrade('u', 23)) gain = gain.times(1e45)
	if (hasUpgrade('i', 11)) gain = gain.times(1e222)
	if (getBuyableAmount('c', 15).gt(0)) gain = gain.times(buyableEffect('c', 15))
	if (getBuyableAmount('c', 16).gt(0)) gain = gain.times(buyableEffect('c', 16))
	if (hasMilestone('m', 2)) gain = gain.times(25)
	if (hasMilestone('m', 3)) gain = gain.times(10)
	if (hasMilestone('m', 4)) gain = gain.times(8)
	if (hasMilestone('m', 5)) gain = gain.times(12.5)
	if (hasMilestone('u', 1)) gain = gain.times(1000)
	if (hasMilestone('u', 2)) gain = gain.times(10000)
	if (hasMilestone('u', 3)) gain = gain.times(1000000)
	if (hasMilestone('i', 4)) gain = gain.times(1e100)
	if (hasMilestone('i', 5)) gain = gain.times(1e100)
	if (hasMilestone('i', 6)) gain = gain.times(1e100)
	if (hasUpgrade('i', 11)) {
		let exponent = hasUpgrade('i', 13) ? 300 : hasUpgrade('i', 12) ? 200 : 150
		gain = gain.times(player.i.timeSpaceParticles.max(1).pow(exponent))
	}
	if (hasUpgrade('m', 14)) gain = gain.times(player.m.points.max(1).log(2).max(1))
	if (getBuyableAmount('c', 12).gt(0)) gain = gain.times(buyableEffect('c', 12))
	if (getBuyableAmount('c', 14).gt(0)) gain = gain.times(buyableEffect('c', 14))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
