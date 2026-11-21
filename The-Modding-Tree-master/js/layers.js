function payCucumberUpgrade() {
    if (!hasMilestone("m", 1)) {
        player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].upgrades[this.id].cost)
    }
}

function cucumberUpgradeCanAfford(id) {
    return function() {
        return player.c.points.gte(tmp.c.upgrades[id].cost)
    }
}

function buyMaxGeometricBuyable(layer, id, growthRate) {
    let points = player[layer].points
    let amount = getBuyableAmount(layer, id)
    let nextCost = layers[layer].buyables[id].cost(amount)
    if (points.lt(nextCost)) return

    let bought = points.times(growthRate - 1).div(nextCost).add(1).log(growthRate).floor()
    if (bought.lte(0)) return

    let totalCostFor = count => nextCost.mul(Decimal.pow(growthRate, count).sub(1)).div(growthRate - 1)
    let totalCost = totalCostFor(bought)
    while (totalCost.gt(points)) {
        let fewerBought = bought.sub(1)
        if (fewerBought.gte(bought)) return
        bought = fewerBought
        totalCost = totalCostFor(bought)
    }

    let nextTotalCost = totalCostFor(bought.add(1))
    while (nextTotalCost.lte(points)) {
        let moreBought = bought.add(1)
        if (moreBought.lte(bought)) break
        bought = moreBought
        totalCost = nextTotalCost
        nextTotalCost = totalCostFor(bought.add(1))
    }

    player[layer].points = points.sub(totalCost)
    setBuyableAmount(layer, id, amount.add(bought))
}

addLayer("c", {
    name: "cucumber", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }
    },
    mid:{
"m": {
distance: 100,
color: "#ffffff",
},
    },
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "cucumber points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(){
    let mult = new Decimal(1)// Calculate the multiplier for main currency from bonuses
if (hasUpgrade('c',13)) {
    let logBase = hasUpgrade('m', 12) ? 3.5 : 10
    mult = mult.times(new Decimal(1)).add(player.points.add(1).log(logBase))
}
    mult = mult.times(buyableEffect('c', 11))
    mult = mult.times(buyableEffect('c', 13))
if (hasMilestone('m', 0)) mult = mult.times(1.7)
if (hasMilestone('m', 1)) mult = mult.times(1.5)
if (hasMilestone('u', 1)) mult = mult.times(1000)
if (hasMilestone('u', 2)) mult = mult.times(10000)
if (hasMilestone('u', 3)) mult = mult.times(1000000)
if (hasMilestone('i', 0)) mult = mult.times(10000)
if (hasMilestone('i', 1)) mult = mult.times(1000000)
if (hasMilestone('i', 2)) mult = mult.times(1e45)
if (hasMilestone('i', 3)) mult = mult.times(1e45)
if (hasMilestone('i', 4)) mult = mult.times(1e100)
if (hasMilestone('i', 5)) mult = mult.times(1e100)
if (hasMilestone('i', 6)) mult = mult.times(1e100)
if (hasUpgrade('m', 15)) mult = mult.times(225000)
if (hasUpgrade('i', 11)) mult = mult.times(1e222)
if (hasUpgrade('m', 22)) mult = mult.times(1000000)
if (hasUpgrade('u', 11)) mult = mult.times(1000000)
if (hasUpgrade('u', 12)) mult = mult.times(10000000)
if (hasUpgrade('u', 15)) mult = mult.times(2.22e22)
if (hasUpgrade('u', 23)) mult = mult.times(1e45)
if (hasUpgrade('u', 22)) mult = mult.times(1e33)
if (hasUpgrade('c', 31)) mult = mult.times(1e10)
if (hasUpgrade('c', 32)) mult = mult.times(2e11)
if (hasUpgrade('c', 41)) mult = mult.times(6e15)
    mult = mult.times(buyableEffect('c', 15))
    mult = mult.times(buyableEffect('c', 16))
    if (hasUpgrade("i", 11)) {
        let exponent = hasUpgrade("i", 13) ? 300 : hasUpgrade("i", 12) ? 200 : 150
        mult = mult.times(player.i.timeSpaceParticles.max(1).pow(exponent))
    }
    return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for cucumber points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            let keepMoneyUnlock = resettingLayer !== "i" && hasUpgrade(this.layer, 21)
            let keepUpgrade41 = resettingLayer !== "i" && hasUpgrade(this.layer, 41)
            layerDataReset(this.layer)
            if (keepMoneyUnlock) player[this.layer].upgrades.push(21)
            if (keepUpgrade41) player[this.layer].upgrades.push(41)
        }
    },
    autoUpgrade() { return hasMilestone("m", 2) },
    automate() {
        if (hasMilestone("m", 4)) buyMaxBuyable(this.layer, 11)
        if (hasMilestone("u", 1)) buyMaxBuyable(this.layer, 12)
        if (hasMilestone("u", 2)) buyMaxBuyable(this.layer, 13)
        if (hasMilestone("u", 3)) buyMaxBuyable(this.layer, 14)
        if (hasMilestone("u", 4)) {
            buyMaxBuyable(this.layer, 15)
            buyMaxBuyable(this.layer, 16)
        }
    },
    passiveGeneration() { return hasMilestone("u", 0) || hasMilestone("i", 0) ? 1 : 0 },
    layerShown(){return true},
    infoboxes: {
    lore: {
        title: "声明",
        body() { return "由于本游戏为随便乱做的，所以未做任何平衡" },
    },
},
    upgrades:{
	  11: {
title: "双倍黄瓜",
    description: "点数获取翻倍",
    cost: new Decimal(1),
    canAfford: cucumberUpgradeCanAfford(11),
    pay: payCucumberUpgrade,
    unlocked(){return true},
},
       12: {
title: "黄瓜乱世",
description(){
    let logBase = hasUpgrade('m', 11) ? 2 : 5
    let mult = new Decimal(1).add(player.c.points.add(1).log(logBase))
    return "根据黄瓜数量提升点数获取<br>当前倍率：x"+format(mult)
},
    unlocked(){return hasUpgrade('c', 11)},
    cost: new Decimal(3),
    canAfford: cucumberUpgradeCanAfford(12),
    pay: payCucumberUpgrade,
        },
       13: {
title: "Cucumber!!!",
description(){
    let logBase = hasUpgrade('m', 12) ? 3.5 : 10
    let mult = new Decimal(1).add(player.points.add(1).log(logBase))
    return "根据点数数量提升黄瓜获取<br>当前倍率：x"+format(mult)
},
    unlocked(){return hasUpgrade('c', 12)},
    cost: new Decimal(10),
    canAfford: cucumberUpgradeCanAfford(13),
    pay: payCucumberUpgrade,
        },
       14: {
title: "黄瓜殿堂",
    description: "点数获取翻5倍，解锁一个可购买项",
    cost: new Decimal(30),
    canAfford: cucumberUpgradeCanAfford(14),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 13)},
},
       15: {
title: "黄瓜银行",
    description: "点数获取翻6倍",
    cost: new Decimal(3200),
    canAfford: cucumberUpgradeCanAfford(15),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 14)},
},
       21: {
title: "黄瓜GO!",
    description: "解锁新层级",
    cost: new Decimal(40000),
    canAfford: cucumberUpgradeCanAfford(21),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 15)},
},
       22: {
title: "黄瓜之仙",
    description: "解锁一个可购买项",
    cost: new Decimal(5e20),
    canAfford: cucumberUpgradeCanAfford(22),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('m', 13)},
},
       23: {
title: "cucumber god",
    description: "再解锁一个可购买项",
    cost: new Decimal(1e25),
    canAfford: cucumberUpgradeCanAfford(23),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 22)},
},
        24: {
title: "cucumber king",
    description: "最后解锁一个可购买项",
    cost: new Decimal(5.49e48),
    canAfford: cucumberUpgradeCanAfford(24),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 23)},
},
        25: {
title: "cucumber emperor",
    description: "解锁新层级",
    cost: new Decimal(1e100),
    canAfford: cucumberUpgradeCanAfford(25),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 24)},
},
        31: {
title: "dark cucumber",
    description: "黄瓜点数获取乘1e10",
    cost: new Decimal("1e1000"),
    canAfford: cucumberUpgradeCanAfford(31),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('u', 13)},
},
        32: {
title: "infinite cucumber",
    description: "黄瓜点数获取乘2e11",
    cost: new Decimal("1e1310"),
    canAfford: cucumberUpgradeCanAfford(32),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 31)},
},
        33: {
title: "infinite cucumber^2",
    description: "点数获取乘3e12,解锁黄瓜可购买项5",
    cost: new Decimal("1e1500"),
    canAfford: cucumberUpgradeCanAfford(33),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 32)},
},
        34: {
title: "infinite cucumber^3",
    description: "点数获取乘4e13,解锁黄瓜可购买项6",
    cost: new Decimal("1e1630"),
    canAfford: cucumberUpgradeCanAfford(34),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 33)},
},
        35: {
title: "infinite cucumber^10086",
    description: "点数获取乘5e14",
    cost: new Decimal("1e2222"),
    canAfford: cucumberUpgradeCanAfford(35),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 34)},
},
        41: {
title: "114514",
    description: "点数获取乘1e20,解锁新universe升级",
    cost: new Decimal("1e2590"),
    canAfford: cucumberUpgradeCanAfford(41),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 35)},
},
        42: {
title: "114514^2",
    description: "解锁新层级",
    cost: new Decimal("1e10300"),
    canAfford: cucumberUpgradeCanAfford(42),
    pay: payCucumberUpgrade,
    unlocked(){return hasUpgrade('c', 41)},
},
        43: {
            title: "?????",
            description: "解锁新层级",
            cost: new Decimal("e2325000"),
            unlocked() { return hasUpgrade("i", 24) },
},
    },
    buyables: {
    buyMaxText: "购买最大数量",
    11: {
        title: "黄瓜收割机",
        cost(x) { return new Decimal(30).mul(Decimal.pow(2.5, x)) },
        effect(x) { return Decimal.pow(2, x) },
        display() {
            return "每次购买使黄瓜点数获取翻倍<br>拥有数量：" +
                format(getBuyableAmount(this.layer, this.id)) +
                "<br>当前效果：x" + format(buyableEffect(this.layer, this.id)) +
                "<br>下次购买成本：" + format(tmp[this.layer].buyables[this.id].cost) + " 黄瓜点数"
        },
        unlocked() { return hasUpgrade(this.layer, 14) },
        canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) },
        buy() {
            let cost = tmp[this.layer].buyables[this.id].cost
            if (!hasMilestone("m", 5)) {
                player[this.layer].points = player[this.layer].points.sub(cost)
            }
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        buyMaxUnlocked() { return hasMilestone("m", 3) },
        buyMax() {
            if (!hasMilestone("m", 3)) return

            let points = player[this.layer].points
            let nextCost = tmp[this.layer].buyables[this.id].cost
            if (hasMilestone("m", 5)) {
                let amount = points.div(nextCost).log(2.5).floor().add(1)
                if (amount.lte(0)) return
                addBuyables(this.layer, this.id, amount)
                return
            }

            let amount = points.times(1.5).div(nextCost).add(1).log(2.5).floor()
            let totalCostFor = amount => nextCost.mul(Decimal.pow(2.5, amount).sub(1)).div(1.5)
            let totalCost = totalCostFor(amount)
            while (amount.gt(0) && totalCost.gt(points)) {
                amount = amount.sub(1)
                totalCost = totalCostFor(amount)
            }
            let nextTotalCost = totalCostFor(amount.add(1))
            while (nextTotalCost.lte(points)) {
                amount = amount.add(1)
                totalCost = nextTotalCost
                nextTotalCost = totalCostFor(amount.add(1))
            }
            if (amount.lte(0)) return

            player[this.layer].points = points.sub(totalCost)
            addBuyables(this.layer, this.id, amount)
        },
    },
    12: {
        title: "黄瓜平行宇宙",
        cost(x) { return new Decimal(1e8).pow(Decimal.pow(1.5, x)) },
        effect(x) { return player.m.points.pow(x.add(1)).log(10).max(1) },
        display() {
            return "点数获取乘数：x" + format(buyableEffect(this.layer, this.id)) +
                "<br>拥有等级：" + formatWhole(getBuyableAmount(this.layer, this.id)) +
                "<br>下次购买成本：" + format(tmp[this.layer].buyables[this.id].cost) + " 黄瓜点数"
        },
        unlocked() { return hasUpgrade(this.layer, 22) },
        canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) },
        buy() {
            let cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(cost)
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        buyMaxUnlocked() { return hasMilestone("u", 1) },
        buyMax() {
            let points = player[this.layer].points
            let amount = getBuyableAmount(this.layer, this.id)
            let bought = new Decimal(0)

            while (points.gte(this.cost(amount))) {
                points = points.sub(this.cost(amount))
                amount = amount.add(1)
                bought = bought.add(1)
            }

            if (bought.gt(0)) {
                player[this.layer].points = points
                setBuyableAmount(this.layer, this.id, amount)
            }
        },
    },
    13: {
        title: "永恒黄瓜",
        cost(x) { return new Decimal(30).mul(Decimal.pow(10000, x)) },
        effect(x) { return Decimal.pow(3.1415926, x) },
        display() {
            return "每购买一次使黄瓜点数获取乘以 3.1415926" +
                "<br>拥有数量：" + formatWhole(getBuyableAmount(this.layer, this.id)) +
                "<br>当前效果：x" + format(buyableEffect(this.layer, this.id)) +
                "<br>下次购买成本：" + format(tmp[this.layer].buyables[this.id].cost) + " 黄瓜点数"
        },
        unlocked() { return hasUpgrade(this.layer, 23) },
        canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) },
        buy() {
            let cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(cost)
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        buyMaxUnlocked() { return hasMilestone("u", 2) },
        buyMax() {
            let points = player[this.layer].points
            let amount = getBuyableAmount(this.layer, this.id)
            let nextCost = this.cost(amount)
            if (points.lt(nextCost)) return

            let bought
            if (hasMilestone("m", 5)) {
                bought = points.div(nextCost).log(10000).floor().add(1)
            } else {
                bought = points.times(9999).div(nextCost).add(1).log(10000).floor()
            }
            if (bought.lte(0)) return

            let totalCost = nextCost.mul(Decimal.pow(10000, bought).sub(1)).div(9999)
            if (!hasMilestone("m", 5) && totalCost.gt(points)) {
                bought = bought.sub(1)
                if (bought.lte(0)) return
                totalCost = nextCost.mul(Decimal.pow(10000, bought).sub(1)).div(9999)
            }

            if (!hasMilestone("m", 5)) player[this.layer].points = points.sub(totalCost)
            setBuyableAmount(this.layer, this.id, amount.add(bought))
        },
    },
    14: {
        title: "无穷黄瓜",
        cost(x) { return new Decimal(30000).mul(Decimal.pow(12555, x)) },
        effect(x) { return Decimal.pow(3.1415926, x) },
        display() {
            return "每购买一次使点数获取乘以 3.1415926" +
                "<br>拥有数量：" + formatWhole(getBuyableAmount(this.layer, this.id)) +
                "<br>当前效果：x" + format(buyableEffect(this.layer, this.id)) +
                "<br>下次购买成本：" + format(tmp[this.layer].buyables[this.id].cost) + " 黄瓜点数"
        },
        unlocked() { return hasUpgrade(this.layer, 24) },
        canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) },
        buy() {
            let cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(cost)
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        buyMaxUnlocked() { return hasMilestone("u", 3) },
        buyMax() {
            let points = player[this.layer].points
            let amount = getBuyableAmount(this.layer, this.id)
            let nextCost = this.cost(amount)
            if (points.lt(nextCost)) return

            let bought = points.times(12554).div(nextCost).add(1).log(12555).floor()
            if (bought.lte(0)) return

            let totalCost = nextCost.mul(Decimal.pow(12555, bought).sub(1)).div(12554)
            if (totalCost.gt(points)) {
                bought = bought.sub(1)
                if (bought.lte(0)) return
                totalCost = nextCost.mul(Decimal.pow(12555, bought).sub(1)).div(12554)
            }

            player[this.layer].points = points.sub(totalCost)
            setBuyableAmount(this.layer, this.id, amount.add(bought))
        },
    },
    15: {
        title: "终焉黄瓜",
        cost(x) { return new Decimal("1e1100").mul(Decimal.pow(1e100, x)) },
        effect(x) { return Decimal.pow(10, x) },
        display() {
            return "每次购买使点数和黄瓜点数获取乘以 10" +
                "<br>拥有数量：" + formatWhole(getBuyableAmount(this.layer, this.id)) +
                "<br>当前效果：x" + format(buyableEffect(this.layer, this.id)) +
                "<br>下次购买成本：" + format(tmp[this.layer].buyables[this.id].cost) + " 黄瓜点数"
        },
        unlocked() { return hasUpgrade(this.layer, 33) },
        canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) },
        buy() {
            let cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(cost)
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            
        },
        buyMaxUnlocked() { return hasMilestone("u", 4) },
        buyMax() { buyMaxGeometricBuyable(this.layer, this.id, 1e100) },
    },
   16: {
       title: "universe cucumber",
       cost(x) { return new Decimal("1e1000").mul(Decimal.pow(1e99, x)) },
       effect(x) { return Decimal.pow(20, x) },
       display() {
           return "每次购买使点数和黄瓜点数获取乘以 20" +
               "<br>拥有数量：" + formatWhole(getBuyableAmount(this.layer, this.id)) +
               "<br>当前效果：x" + format(buyableEffect(this.layer, this.id)) +
               "<br>下次购买成本：" + format(tmp[this.layer].buyables[this.id].cost) + " 黄瓜点数"
       },
       unlocked() { return hasUpgrade(this.layer, 34) },
       canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) },
       buy() {
           let cost = tmp[this.layer].buyables[this.id].cost
           player[this.layer].points = player[this.layer].points.sub(cost)
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
       },
       buyMaxUnlocked() { return hasMilestone("u", 4) },
       buyMax() { buyMaxGeometricBuyable(this.layer, this.id, 1e99) },
   },
},
}),
addLayer("m", {
    name: 'money', // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: 'M', // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#00eeff",
    resource: "moneys", // Name of prestige currency
    baseResource: "cucumber points", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasMilestone("i", 0)) mult = mult.times(100)
        if (hasMilestone("i", 1)) mult = mult.times(100)
        if (hasMilestone("i", 2)) mult = mult.times(100)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    requires: new Decimal(300000),
    passiveGeneration() { return hasMilestone("i", 0) ? 1 : hasMilestone("u", 0) ? 0.1 : 0 },
    getResetGain() {
        return player.c.points.div(300000).sqrt().floor().times(tmp.m.gainMult).sub(player.m.points).max(0)
    },
    getNextAt() {
        let nextBaseAmount = player.m.points.add(1).div(tmp.m.gainMult).ceil()
        return new Decimal(300000).mul(nextBaseAmount.pow(2))
    },
    canReset() {
        return player.c.points.gte(this.getNextAt())
    },
    prestigeButtonText() {
        return "重置获得 +" + formatWhole(tmp[this.layer].resetGain) + " moneys<br>需要 " +
            formatWhole(tmp[this.layer].nextAt) + " 黄瓜点数（当前：" + formatWhole(player.c.points) + "）"
    },
    hotkeys: [
        {key: "m", description: "M: Reset for moneys", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer)
            if (resettingLayer === "i") player[this.layer].unlocked = false
        }
    },
    autoUpgrade() { return hasMilestone("i", 1) },
    layerShown(){return hasUpgrade('c', 21) || player[this.layer].unlocked},
    infoboxes: {
    lore: {
        title: "前言",
        body() { return "你拥有了许多黄瓜，你决定用黄瓜卖钱。" },
    },
},
    milestones: {
        0: {
            requirementDescription: "获得 1 moneys",
            effectDescription: "黄瓜点数获取翻1.7倍",
            done() { return player.m.points.gte(1) }
        },
        1: {
            requirementDescription: "获得 2 moneys",
            effectDescription: "黄瓜点数获取乘以 1.5；购买黄瓜升级不消耗黄瓜点数（仍需达到升级价格）",
            done() { return player.m.points.gte(2) }
        },
        2: {
            requirementDescription: "获得 8 moneys",
            effectDescription: "点数获取乘以 25，并自动购买黄瓜升级",
            done() { return player.m.points.gte(8) }
        },
        3: {
            requirementDescription: "获得 1500 moneys",
            effectDescription: "点数获取乘以 10，并解锁黄瓜收割机最大购买",
            done() { return player.m.points.gte(1500) }
        },
        4: {
            requirementDescription: "获得 8000 moneys",
            effectDescription: "点数获取乘以 8，并自动购买最大数量的黄瓜收割机",
            done() { return player.m.points.gte(8000) }
        },
        5: {
            requirementDescription: "获得 80000 moneys",
            effectDescription: "点数获取乘以 12.5；购买黄瓜收割机不消耗黄瓜点数（仍需达到价格）",
            done() { return player.m.points.gte(80000) }
        },
        6: {
            requirementDescription: "获得 1000000 moneys",
            effectDescription: "解锁money升级",
            done() { return player.m.points.gte(1000000) }
        }
    },
    upgrades: {
        11: {
            title: "黄瓜星球",
            description: "黄瓜升级2公式中的 log(5) 改为 log(2)",
            cost: new Decimal(1000000),
            unlocked() { return hasMilestone("m", 6) },
        },
        12: {
            title: "黄瓜之神",
            description: "黄瓜升级3公式中的 log(10) 改为 log(3.5)",
            cost: new Decimal(6000000),
            unlocked() { return hasUpgrade('m', 11) },
        },
        13: {
            title: "黄瓜之王",
            description: "解锁新黄瓜升级",
            cost: new Decimal(25000000),
            unlocked() { return hasUpgrade('m', 12) },
        },
        14: {
            title: "黄瓜盛世",
            description(){
                // logBase should be defined based on upgrade or milestone conditions; it determines the logarithm base for the multiplier calculation.
                // Please ensure logBase is set before using it below.
                let logBase = 2 // Example: set logBase to 2, or adjust as needed
                let mult = new Decimal(1).add(player.m.points.add(1).log(logBase));
                return "点数获取乘以 max(1, log2(moneys))<br>当前倍率：x"+format(mult);
            },
            cost: new Decimal(1e160),
            unlocked() { return hasMilestone("u", 2) },
        },
        15: {
            title: "黄瓜之圣",
            description: "黄瓜点数获取乘255000",
            cost: new Decimal(1e170),
            unlocked() { return hasUpgrade('m', 14) },
        },
        21: {
            title: "!?黄瓜!?",
            description: "点数获取乘1000000",
            cost: new Decimal(1e219),
            unlocked() { return hasUpgrade('m', 15) },
        },
        22: {
            title: "!?瓜瓜!?",
            description: "黄瓜点数获取乘1000000",
            cost: new Decimal(1e250),
            unlocked() { return hasUpgrade('m', 21) },
        },
        23: {
            title: "!?瓜瓜*100!?",
            description: "黄瓜点数和获点数取乘1000000,解锁universe层级的新东西",
            cost: new Decimal(1e300),
            unlocked() { return hasUpgrade('m', 22) },
        },
    },
})
addLayer("u", {
    name: 'universe', // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: 'U', // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#f700ff",
    resource: "universes", // Name of prestige currency
    baseResource: "cucumber points", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1) // Initialize gain multiplier
        if (hasUpgrade("u",14)) mult = mult.times(10)
        if (hasUpgrade("u",21)) mult = mult.times(25)
        if (hasUpgrade("u",22)) mult = mult.times(100)
        if (hasMilestone("i", 0)) mult = mult.times(10)
        if (hasMilestone("i", 1)) mult = mult.times(10)
        if (hasMilestone("i", 2)) mult = mult.times(10)
        return mult
    },
    passiveGeneration() { return hasMilestone("i", 5) ? 1 : 0 },
    requires: new Decimal("1e100"),
    getResetGain() {
        let baseAmount = player.c.points
        if (baseAmount.lt(this.requires)) return new Decimal(0)
        let totalUniverses = baseAmount.log(10).sub(100).div(10).floor().add(1)

        return totalUniverses.times(tmp.u.gainMult)
    },
    getNextAt() {
        let totalUniverses = this.getResetGain().div(tmp.u.gainMult)
        return Decimal.pow(10, new Decimal(100).add(totalUniverses.times(10)))
    },
    canReset() {
        return player.c.points.gte(this.requires)
    },
    prestigeButtonText() {
        return "重置获得 +" + formatWhole(tmp[this.layer].resetGain) + " universes<br>需要 " +
            format(tmp[this.layer].nextAt) + " 黄瓜点数"
    },
    layerShown() {
        return player.c.points.gte(this.requires) || player[this.layer].unlocked
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer, resettingLayer === "i" ? [] : ["points"])
            if (resettingLayer === "i") player[this.layer].unlocked = false
        }
    },
    autoUpgrade() { return hasMilestone("i", 3) },
    milestones: {
        0: {
            requirementDescription: "获得 1 universes",
            effectDescription: "每秒钟获得 100% 可重置获得的黄瓜点数和 10% 可重置获得的 moneys",
            done() { return player.u.points.gte(1) }
        },
        1: {
            requirementDescription: "获得 3 universes",
            effectDescription: "点数和黄瓜点数获取乘1000，自动购买最大黄瓜层级可购买项2",
            done() { return player.u.points.gte(3) }
        },
        2: {
            requirementDescription: "获得 15 universes",
            effectDescription: "点数和黄瓜点数获取乘10000，自动购买最大黄瓜层级可购买项3,解锁money升级4",
            done() { return player.u.points.gte(15) }
        },
        3: {
            requirementDescription: "获得 80 universes",
            effectDescription: "点数和黄瓜点数获取乘1000000，自动购买最大黄瓜层级可购买项4,解锁universe升级",
            done() { return player.u.points.gte(80) }
        },
        4: {
            requirementDescription: "获得 1e3500 黄瓜点数",
            effectDescription: "自动购买最大黄瓜层级可购买项5,6",
            done() { return player.c.points.gte("1e3500") }
        },
    },
    upgrades: {
        11: {
            title: "黄瓜万世",
            description: "黄瓜点数获取乘1000000,点数获取乘10000000",
            cost: new Decimal(1000),
            unlocked() { return hasMilestone("u", 3) },
        },
        12: {
            title: "轮回黄瓜",
            description: "黄瓜点数获取乘10000000,点数获取乘1000000",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("u", 11) },
        },
        13: {
            title: "黄瓜宇宙",
            description: "解锁新黄瓜升级",
            cost: new Decimal(2000),
            unlocked() { return hasUpgrade("u", 12) },
        },
        14: {
            title: "hghg",
            description: "宇宙获取乘10",
            cost: new Decimal(2000),
            unlocked() { return hasUpgrade("c", 41) },
        },
        15: {
            title: "[妄念]",
            description: "点数和黄瓜点数获取乘2.2e22",
            cost: new Decimal(30000),
            unlocked() { return hasUpgrade("u", 14) },
        },
        21: {
            title: "hghg^2",
            description: "宇宙获取乘25",
            cost: new Decimal(100000),
            unlocked() { return hasUpgrade("u", 15) },
        },
        22: {
            title: "!?不做平衡!?",
            description: "宇宙获取乘100，黄瓜点数和点数乘1e33",
            cost: new Decimal(1000000),
            unlocked() { return hasUpgrade("u", 21) },
        },
        23: {
            title: "!?数值膨胀!?",
            description: "黄瓜点数和点数乘1e45",
            cost: new Decimal(100000000),
            unlocked() { return hasUpgrade("u", 22) },
        },
    }
}),
addLayer("i", {
    name: 'infinity', // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: 'I', // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 2, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        timeSpaceParticles: new Decimal(0),
        oneDimensionalSpace: new Decimal(0),
        twoDimensionalSpace: new Decimal(0),
        threeDimensionalSpace: new Decimal(0),
        fourDimensionalSpace: new Decimal(0),
    }},
    color: "#ff7700",
    resource: "infinities", // Name of prestige currency
    baseResource: "cucumber points", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1) // Initialize gain multiplier
        if (hasUpgrade('i', 14)) mult = mult.times(10)
        if (hasUpgrade('i', 15)) mult = mult.times(10)
        if (hasUpgrade('i', 21)) mult = mult.times(10)
        if (hasUpgrade('i', 22)) mult = mult.times(12)
        if (hasUpgrade('i', 24)) mult = mult.times(12)
        return mult
    },
    requires: new Decimal("1e10300"),
    getResetGain() {
        let baseAmount = player.c.points
        if (baseAmount.lt(this.requires)) return new Decimal(0)
        let totalInfinities = baseAmount.log(10).sub(10300).div(308).floor().add(1)

        return totalInfinities.times(tmp.i.gainMult)
    },
    getNextAt() {
        let totalInfinities = this.getResetGain().div(tmp.i.gainMult)
        return Decimal.pow(10, new Decimal(10300).add(totalInfinities.times(308)))
    },
    canReset() {
        return player.c.points.gte(this.requires)
    },
    prestigeButtonText() {
        return "重置获得 +" + formatWhole(tmp[this.layer].resetGain) + " infinities<br>需要 " +
            format(tmp[this.layer].nextAt) + " 黄瓜点数"
    },
    layerShown() {
        return player.i.points.gte(this.requires) || player[this.layer].unlocked
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer, ["points", "timeSpaceParticles", "oneDimensionalSpace", "twoDimensionalSpace", "threeDimensionalSpace", "fourDimensionalSpace"])
        }
    },
    update(diff) {
        if (hasUpgrade("i", 11)) {
            let particleGain = Decimal.pow(2, player.i.upgrades.length).times(player.i.oneDimensionalSpace.max(1))
            if (hasUpgrade("i", 24)) {
                let spaceProduct = player.i.oneDimensionalSpace
                    .times(player.i.twoDimensionalSpace)
                    .times(player.i.threeDimensionalSpace)
                    .times(player.i.fourDimensionalSpace)
                particleGain = particleGain.times(spaceProduct.pow(2))
            }
            if (hasUpgrade("o", 12)) particleGain = particleGain.pow(2)
            player.i.timeSpaceParticles = player.i.timeSpaceParticles.add(particleGain.times(diff))
        }
        if (hasUpgrade("i", 14)) {
            let spaceGainMultiplier = (hasUpgrade("i", 21) ? 25 : 1) * (hasUpgrade("i", 22) ? 100 : 1)
            let originSpaceGainMultiplier = new Decimal(1)
            if (hasUpgrade("o", 15)) originSpaceGainMultiplier = originSpaceGainMultiplier.times("1e666")
            if (hasUpgrade("o", 22)) originSpaceGainMultiplier = originSpaceGainMultiplier.times("1e2000")
            let oneDimensionalSpaceGain = player.i.twoDimensionalSpace.max(1)
                .times(spaceGainMultiplier)
                .times(originSpaceGainMultiplier)
            let twoDimensionalSpaceGain = hasUpgrade("i", 21)
                ? player.i.threeDimensionalSpace.times(spaceGainMultiplier)
                : new Decimal(1)
            twoDimensionalSpaceGain = twoDimensionalSpaceGain.times(originSpaceGainMultiplier)
            player.i.oneDimensionalSpace = player.i.oneDimensionalSpace.add(oneDimensionalSpaceGain.times(diff))
            player.i.twoDimensionalSpace = player.i.twoDimensionalSpace.add(twoDimensionalSpaceGain.times(diff))
        }
        if (hasUpgrade("i", 21)) {
            let threeDimensionalSpaceGain = new Decimal(1)
            if (hasUpgrade("i", 22)) {
                threeDimensionalSpaceGain = player.i.fourDimensionalSpace.times(100)
            }
            if (hasUpgrade("o", 14)) {
                threeDimensionalSpaceGain = threeDimensionalSpaceGain.times("1e150")
            }
            player.i.threeDimensionalSpace = player.i.threeDimensionalSpace.add(threeDimensionalSpaceGain.times(diff))
        }
        if (hasUpgrade("i", 22)) {
            let fourDimensionalSpaceGain = hasUpgrade("o", 13) ? new Decimal("1e100") : new Decimal(1)
            fourDimensionalSpaceGain = fourDimensionalSpaceGain.times(buyableEffect("o", 11))
            player.i.fourDimensionalSpace = player.i.fourDimensionalSpace.add(fourDimensionalSpaceGain.times(diff))
        }
        if (hasMilestone("i", 4)) {
            if (!player.m.unlocked || !player.u.unlocked) needCanvasUpdate = true
            player.m.unlocked = true
            player.u.unlocked = true
        }
    },
    midsection: [
        ["display-text", function() {
            let spaceGainMultiplier = (hasUpgrade("i", 21) ? 25 : 1) * (hasUpgrade("i", 22) ? 100 : 1)
            let originSpaceGainMultiplier = new Decimal(1)
            if (hasUpgrade("o", 15)) originSpaceGainMultiplier = originSpaceGainMultiplier.times("1e666")
            if (hasUpgrade("o", 22)) originSpaceGainMultiplier = originSpaceGainMultiplier.times("1e2000")
            let twoDimensionalSpaceGain = hasUpgrade("i", 14)
                ? (hasUpgrade("i", 21)
                    ? player.i.threeDimensionalSpace.times(spaceGainMultiplier)
                    : new Decimal(1))
                : new Decimal(0)
            if (hasUpgrade("i", 14)) {
                twoDimensionalSpaceGain = twoDimensionalSpaceGain.times(originSpaceGainMultiplier)
            }
            let oneDimensionalSpaceGain = hasUpgrade("i", 14)
                ? player.i.twoDimensionalSpace.max(1)
                    .times(spaceGainMultiplier)
                    .times(originSpaceGainMultiplier)
                : new Decimal(0)
            let threeDimensionalSpaceGain = hasUpgrade("i", 21) ? new Decimal(1) : new Decimal(0)
            if (hasUpgrade("i", 21) && hasUpgrade("i", 22)) {
                threeDimensionalSpaceGain = player.i.fourDimensionalSpace.times(100)
            }
            if (hasUpgrade("i", 21) && hasUpgrade("o", 14)) {
                threeDimensionalSpaceGain = threeDimensionalSpaceGain.times("1e150")
            }
            let fourDimensionalSpaceGain = hasUpgrade("i", 22)
                ? (hasUpgrade("o", 13) ? new Decimal("1e100") : new Decimal(1))
                : new Decimal(0)
            if (hasUpgrade("i", 22)) {
                fourDimensionalSpaceGain = fourDimensionalSpaceGain.times(buyableEffect("o", 11))
            }
            let particleGain = hasUpgrade("i", 11)
                ? Decimal.pow(2, player.i.upgrades.length).times(player.i.oneDimensionalSpace.max(1))
                : new Decimal(0)
            if (hasUpgrade("i", 11) && hasUpgrade("i", 24)) {
                let spaceProduct = player.i.oneDimensionalSpace
                    .times(player.i.twoDimensionalSpace)
                    .times(player.i.threeDimensionalSpace)
                    .times(player.i.fourDimensionalSpace)
                particleGain = particleGain.times(spaceProduct.pow(2))
            }
            if (hasUpgrade("o", 12)) particleGain = particleGain.pow(2)
            let exponent = hasUpgrade("o",11) ? 1225 : hasUpgrade("i",23) ? 900 : hasUpgrade("i", 13) ? 300 : hasUpgrade("i", 12) ? 200 : 150
            let particleMultiplier = hasUpgrade("i", 11) ? player.i.timeSpaceParticles.max(1).pow(exponent) : new Decimal(1)
            return "四维时空：" + format(player.i.fourDimensionalSpace) +
                "<br>四维时空获取速度：" + format(fourDimensionalSpaceGain) + "/秒" +
                "<br>三维时空：" + format(player.i.threeDimensionalSpace) +
                "<br>三维时空获取速度：" + format(threeDimensionalSpaceGain) + "/秒" +
                "<br>二维时空：" + format(player.i.twoDimensionalSpace) +
                "<br>二维时空获取速度：" + format(twoDimensionalSpaceGain) + "/秒" +
                "<br>一维时空：" + format(player.i.oneDimensionalSpace) +
                "<br>一维时空获取速度：" + format(oneDimensionalSpaceGain) + "/秒" +
                "<br>时空粒子：" + format(player.i.timeSpaceParticles) +
                "<br>时空粒子获取速度：" + format(particleGain) + "/秒" +
                "<br>点数与黄瓜点数获取倍率：x" + format(particleMultiplier) +
                "（指数：" + exponent + "）"
        }],
    ],
    milestones:{
0: {
            requirementDescription: "获得 1 infinity point",
            effectDescription: "每秒钟获得 100% 可重置获得的黄瓜点数和 100% 可重置获得的 moneys,黄瓜点数获取乘10000，money获取乘100,宇宙获取乘10",
            done() { return player.i.points.gte(1) }
        },
1: {
            requirementDescription: "获得 2 infinity point",
            effectDescription: "自动购买money层的升级，黄瓜点数获取乘1000000，money获取乘100,宇宙获取乘10",
            done() { return player.i.points.gte(2) }
        },
2: {
            requirementDescription: "获得 5 infinity point",
            effectDescription: "黄瓜点数获取乘1e45，money获取乘100,宇宙获取乘10",
            done() { return player.i.points.gte(5) }
        },
3: {
            requirementDescription: "获得 13 infinity point",
            effectDescription: "自动购买宇宙层的升级,黄瓜点数获取乘1e45",
            done() { return player.i.points.gte(13) }
        },
4: {
            requirementDescription: "获得 32 infinity point",
            effectDescription: "自动解锁m和u层级,黄瓜点数和点数获取乘1e100",
            done() { return player.i.points.gte(32) }
        },
5: {
            requirementDescription: "获得 100 infinity point",
            effectDescription: "每秒钟获得 100% 可重置获得的宇宙,黄瓜点数和点数获取乘1e100",
            done() { return player.i.points.gte(100) }
        },
6: {
            requirementDescription: "获得 500 infinity point",
            effectDescription: "黄瓜点数和点数获取乘1e100,解锁无限升级",
            done() { return player.i.points.gte(500) }
        },
    },
    upgrades:{
11: {
            title: "@!#Y%#!$%%%&^",
            description: "黄瓜点数和点数获取乘1e222",
            cost: new Decimal(500),
            unlocked() { return hasMilestone("i", 6) },
        },
12: {
            title: "mrtnb",
            description: "时空粒子的公式指数由150变为200",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("i", 11) },
        },
13: {
            title: "mrtnb^2",
            description: "时空粒子的公式指数由200变为300",
            cost: new Decimal(2000),
            unlocked() { return hasUpgrade("i", 12) },
        },
14: {
           title: "反物质维度",
            description: "无限点数获取乘10,解锁一维时空",
            cost: new Decimal(4000),
            unlocked() { return hasUpgrade("i", 13) },
        },
15: {
           title: "反物质维度^2",
            description: "无限点数获取乘10,解锁二维时空",
            cost: new Decimal(50000),
            unlocked() { return hasUpgrade("i", 14) },
        },
21: {
           title: "反物质维度^3.33",
            description: "无限点数获取乘10,一维时空和二维时空获取乘25,解锁三维时空",
            cost: new Decimal(1000000),
            unlocked() { return hasUpgrade("i", 15) },
        },
22: {
           title: "反物质维度^4.41",
            description: "无限点数获取乘12,一维,二维时空和三维时空获取乘100,解锁四维时空",
            cost: new Decimal(10000000),
            unlocked() { return hasUpgrade("i", 21) },
        },
23: {
            title: "mrtnb^3",
            description: "时空粒子的公式指数由300变为900",
            cost: new Decimal(1e8),
            unlocked() { return hasUpgrade("i", 22) },
        },
24: {
            title: "!?!?!?",
            description: "无限点数获取乘12,时空粒子获取乘(1~4维时空维度数量之积^2)",
            cost: new Decimal(1.5e8),
            unlocked() { return hasUpgrade("i", 23) },
        },
    }
}),
addLayer("o", {
    name: 'origin', // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: 'O', // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 2, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#ffffff",
    resource: "origin", // Name of prestige currency
    baseResource: "cucumber points", // Name of resource prestige is based on
     baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1) // Initialize gain multiplier
        return mult
    },
     requires: new Decimal("e2325000"),
    getResetGain() {
        let baseAmount = player.c.points
        if (baseAmount.lt(this.requires)) return new Decimal(0)
        let totalOrigin = baseAmount.log(10).sub(2325000).div(1000000).floor().add(1)

        return totalOrigin.times(tmp.o.gainMult)
    },
    getNextAt() {
        let totalOrigin = this.getResetGain().div(tmp.o.gainMult)
        return Decimal.pow(10, new Decimal(2325000).add(totalOrigin.times(1000000)))
    },
    canReset() {
        return player.c.points.gte(this.requires)
    },
    prestigeButtonText() {
        return "重置获得 +" + formatWhole(tmp[this.layer].resetGain) + " origin<br>需要 " +
            format(tmp[this.layer].nextAt) + " 黄瓜点数"
    },
    layerShown() {
        return player.c.points.gte(this.requires) || player[this.layer].unlocked
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer, ["points", "timeSpaceParticles", "oneDimensionalSpace", "twoDimensionalSpace", "threeDimensionalSpace", "fourDimensionalSpace"])
        }
    },
    upgrades: {
        11: {
            title: "!#!$#%^%&^&*^",
            description: "时空粒子获取指数加325",
            cost: new Decimal(1),
            unlocked() { return true },
        },
        12: {
            title: "DFTT#%@$@YY^E%",
            description: "时空粒子获取^2",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('o',11) },
        },
        13: {
            title: "Y$%W#^QYRU",
            description: "四维时空获取乘1e100",
            cost: new Decimal(4),
            unlocked() { return hasUpgrade('o',12) },
        },
        14: {
            title: "J%%@$T#^YY%",
            description: "三维时空获取乘1e150",
            cost: new Decimal(9),
            unlocked() { return hasUpgrade('o',13) },
        },
        15: {
            title: "%@#%#Y%JYBEE",
            description: "一,和二维时空获取乘1e666",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('o',14) },
        },
        21: {
            title: "123456",
            description: "解锁1维原点",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade('o',15) },
        },
        22: {
            title: "admin",
            description: "一,和二维时空获取乘1e2000",
            cost: new Decimal(501),
            unlocked() { return hasUpgrade('o',21) },
        },
        23: {
            title: "ccc",
            description: "抵达0.01版本终点（急着上传)",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade('o',22) },
        },
    },
    buyables: {
        11: {
            title: "一维原点",
            cost(x) {
                return new Decimal(5).pow(Decimal.pow(2, x))
            },
            effect(x) {
                return Decimal.pow(10, x.times(22))
            },
            display() {
                return "每级使四维时空获取速度乘1e22<br>当前等级：" +
                    formatWhole(getBuyableAmount(this.layer, this.id)) +
                    "<br>当前效果：x" + format(buyableEffect(this.layer, this.id)) +
                    "<br>下一级成本：" + format(tmp[this.layer].buyables[this.id].cost) + " origin"
            },
            unlocked() { return hasUpgrade("o", 21) },
            canAfford() { return player.o.points.gte(tmp.o.buyables[this.id].cost) },
            buy() {
                let cost = tmp.o.buyables[this.id].cost
                player.o.points = player.o.points.sub(cost)
                setBuyableAmount("o", this.id, getBuyableAmount("o", this.id).add(1))
            },
        },
    },
})