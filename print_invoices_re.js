// 如果要给程序添加一个特性，发现代码缺乏良好的结构不易于梗概
// 就先重构程序，使其容易修改，再添加新特性。

// 重构步骤：
// 1. 提炼函数（一个函数只做一件事，并且要有测试集来测试）。
// 2，修改函数内的变量（命名/传参）
// 3. 如果一个变量由另一个传入参数得到的，不需要传两个(以查询取代临时变量)。
// 4. 尽量先移除局部变量，使需要关注的变量变少。 
//

var staticPlays;
var staticInvoice;
module.exports = function statement (invoice, plays) {
		return renderPlainText(invoice, plays);
}

function renderPlainText(invoice, plays) {
		staticPlays = plays;
		staticInvoice = invoice;
		let result = `Statement for ${invoice.customer}\n`;
		for (let perf of invoice.performances) {
				// print line for this order
				result += ` ${playFor(perf).name}: ${formatUSD(amountFor(perf))}(${perf.audience} seats)\n`
		}
		result += `Amount owed is ${formatUSD(appleSauce()/100)}\n`;
		result += `You earned ${totalVolumeCredits()} credits\n`;
		return result;
}

function appleSauce() {
		let result = 0;
		for (let perf of staticInvoice.performances) {
				result += amountFor(perf);
		}
		return result;
}

function totalVolumeCredits() {
		let result = 0;
		for (let perf of staticInvoice.performances) {
				result += volumeCreditsFor(perf);  // 移除改变变量的逻辑。
		}
		return result;
}

function volumeCreditsFor(aPerformance) {
		let volumeCredits = 0;
		volumeCredits += Math.max(aPerformance.audience - 30, 0);
		if ("comedy" === playFor(aPerformance).type) volumeCredits += Math.floor(aPerformance.audience/5);
		return volumeCredits;
}

function formatUSD(aNumber) {
		return new Intl.NumberFormat("en-US",
												{style: "currency", currency:"USD",
												 minimunFractionDigits: 2}).format(aNumber/100);
}

function amountFor(aPerformance) {
		let result = 0;

		switch (playFor(aPerformance).type) {
				case "tragedy":
						result = 40000;
						if (aPerformance.audience > 30) {
								result += 1000 * (aPerformance.audience - 30);
						}
						break;
				case "comedy":
						result = 30000;
						if (aPerformance.audience > 20) {
								result += 1000 + 500 * (aPerformance.audience - 20);
						}
						result += 300 * aPerformance.audience;
						break;
				default:
						throw new Error(`unknown type: ${playFor(aPerformance).type}`);
		}
		return result;
}

function playFor(aPerformance) {
		return staticPlays[aPerformance.playID];
}
