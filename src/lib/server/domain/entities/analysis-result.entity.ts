export class AnalysisResult {
    constructor(
        public readonly symbol: string,
        public readonly investment: number,
        public readonly numberOfCoins: number,
        public readonly profit: number,
        public readonly growthFactor: number,
        public readonly lambos: number,
        public readonly generationDate: Date = new Date()
    ) { }

    static calculate(symbol: string, investment: number, startPrice: number, endPrice: number): AnalysisResult {
        if (startPrice <= 0) {
            throw new Error('Invalid start price for calculation');
        }

        const numberOfCoins = investment / startPrice;
        const profit = numberOfCoins * endPrice - investment;
        const growthFactor = profit / investment;
        const lambos = profit / 200000;

        return new AnalysisResult(
            symbol,
            investment,
            parseFloat(numberOfCoins.toFixed(2)),
            parseFloat(profit.toFixed(2)),
            parseFloat(growthFactor.toFixed(2)),
            parseFloat(lambos.toFixed(2))
        );
    }

    toDTO() {
        return {
            query: `${this.symbol}-${this.investment}`,
            symbol: this.symbol,
            investment: this.investment,
            numberOfCoins: this.numberOfCoins,
            profit: this.profit,
            growthFactor: this.growthFactor,
            lambos: this.lambos,
        };
    }

    toLegacyFormat() {
        return {
            NUMBERCOINS: this.numberOfCoins,
            PROFIT: this.profit,
            GROWTHFACTOR: this.growthFactor,
            LAMBOS: this.lambos,
            INVESTMENT: this.investment,
            SYMBOL: this.symbol,
            GENERATIONDATE: this.generationDate.toISOString()
        };
    }
}
