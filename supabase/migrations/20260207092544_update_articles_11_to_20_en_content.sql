/*
  # Update English articles 11-20 with real content

  1. Modified Tables
    - `blog_posts` - Updated title, excerpt, content, category, tags for articles 11-20 in English
*/

UPDATE blog_posts SET
  title = 'Japanese Candlestick Patterns: A Beginner''s Guide',
  excerpt = 'Learn how to read Japanese candlestick charts and use candlestick patterns to predict price movement.',
  category = 'Education',
  tags = ARRAY['candlesticks', 'technical analysis', 'patterns', 'charts'],
  reading_time = 8,
  author = 'Alex Volkov',
  image_url = 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>What Are Japanese Candlesticks</h2>
<p>Japanese candlesticks are a method of displaying price information on a chart, invented by Japanese rice trader Munehisa Homma in the 18th century. Each candle shows four key price values for a specific period: open, close, high, and low.</p>

<h2>Anatomy of a Candle</h2>
<p>A candle consists of a body and shadows (wicks). The body represents the difference between opening and closing prices. If the closing price is higher than the opening, the candle is bullish (usually green or white). If lower, it is bearish (red or black). The upper shadow shows the high, the lower shadow shows the low.</p>

<h2>Basic Single Patterns</h2>
<p>Doji — a candle with a very small body where open and close prices nearly match. Signals market indecision. Hammer — a candle with a small body and long lower shadow appearing at the bottom of a downtrend. Indicates possible upward reversal. Shooting Star — the mirror of a hammer at the top of an uptrend.</p>

<h2>Double Patterns</h2>
<p>Bullish Engulfing — a small bearish candle followed by a large bullish one that completely engulfs the previous. Strong upward reversal signal. Bearish Engulfing — the opposite situation. Tweezers — two candles with matching highs (at top) or lows (at bottom), signaling reversal.</p>

<h2>Triple Patterns</h2>
<p>Morning Star — a three-candle reversal pattern at a trend bottom: large bearish candle, small candle (doji or spinning top), large bullish candle. Evening Star — the mirror pattern at the top. Three White Soldiers — three consecutive bullish candles with growing bodies confirming uptrend strength.</p>

<h2>Practical Application</h2>
<p>Candlestick patterns are most effective combined with other technical analysis tools: support and resistance levels, trading volumes, and technical indicators. Do not rely on a single pattern — look for signal confirmation from multiple sources.</p>'
WHERE slug = 'article-11-en';

UPDATE blog_posts SET
  title = 'How to Create an Effective Trading Plan',
  excerpt = 'Step-by-step guide to creating a trading plan — from defining goals to risk management and performance evaluation.',
  category = 'Strategies',
  tags = ARRAY['trading plan', 'strategy', 'discipline', 'management'],
  reading_time = 7,
  author = 'Maria Sokolova',
  image_url = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>Why You Need a Trading Plan</h2>
<p>A trading plan is your roadmap in financial markets. Without it, trading becomes gambling. A plan helps make rational decisions, control emotions, and systematically evaluate results. Statistics show that traders with clear plans perform significantly better.</p>

<h2>Define Your Goals</h2>
<p>Start by formulating specific, measurable goals. What return do you want? What maximum loss is acceptable? How much time can you dedicate to trading? Your goals must be realistic — expecting 100% monthly profit will lead to excessive risk.</p>

<h2>Choose Markets and Instruments</h2>
<p>Determine which markets you will trade: Forex, stocks, cryptocurrencies, commodities. Select specific instruments and study their characteristics. It is better to trade a few well-studied instruments than to spread across dozens of unfamiliar ones.</p>

<h2>Entry and Exit Rules</h2>
<p>Clearly describe conditions for opening and closing positions. What signals do you use for entry? Where do you place stop-loss and take-profit? Rules must be specific and unambiguous — leave no room for subjective interpretation.</p>

<h2>Risk Management</h2>
<p>Include risk management rules: maximum risk per trade (1-2%), maximum daily loss, maximum number of open positions. Determine when you stop trading for the day or week.</p>

<h2>Evaluation and Adjustment</h2>
<p>Regularly analyze trading results. Keep statistics: win rate, average profit/loss ratio, maximum drawdown. Adjust the plan based on data, but do not change rules after every losing trade.</p>'
WHERE slug = 'article-12-en';

UPDATE blog_posts SET
  title = 'Moving Averages: Complete Guide to Application',
  excerpt = 'Everything about moving averages — types, settings, strategies, and practical application in trading.',
  category = 'Technical Analysis',
  tags = ARRAY['moving averages', 'indicators', 'trend', 'SMA', 'EMA'],
  reading_time = 9,
  author = 'Dmitry Kozlov',
  image_url = 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>What Are Moving Averages</h2>
<p>A Moving Average (MA) is one of the most popular and versatile technical indicators. It calculates the average price value over a specific period, creating a line that smooths price fluctuations and helps determine trend direction.</p>

<h2>Types of Moving Averages</h2>
<p>Simple Moving Average (SMA) calculates the arithmetic mean of prices over a given period. Exponential (EMA) gives more weight to recent prices, reacting faster to changes. Weighted (WMA) also emphasizes recent prices. For most strategies, EMA is preferred due to less lag.</p>

<h2>Popular Periods</h2>
<p>MA 20 — short-term trend, popular for intraday trading. MA 50 — medium-term trend, used by swing traders. MA 100 and MA 200 — long-term trend, key reference for position traders. MA 200 is considered one of the most important indicators — its direction defines the global trend.</p>

<h2>Crossover Strategy</h2>
<p>When a short MA (e.g., 50) crosses above a long one (200), it is a Golden Cross — a bullish signal. A cross below is a Death Cross — bearish. This strategy works well in trending markets but gives false signals in sideways movement.</p>

<h2>MA as Support and Resistance</h2>
<p>Moving averages often act as dynamic support and resistance levels. In an uptrend, price frequently bounces off MA 50 or MA 200. Traders use these bounces to enter positions along the trend with minimal risk.</p>

<h2>Limitations</h2>
<p>The main disadvantage of MA is lag. Signals form after movement begins. In sideways markets, MA gives many false signals. Therefore, it is recommended to use MA in combination with other indicators and market context analysis.</p>'
WHERE slug = 'article-13-en';

UPDATE blog_posts SET
  title = 'Demo Account: Why Every Trader Needs One',
  excerpt = 'Learn why demo trading is essential for beginners and a useful tool for experienced traders.',
  category = 'Education',
  tags = ARRAY['demo account', 'learning', 'practice', 'beginners'],
  reading_time = 6,
  author = 'Anna Petrova',
  image_url = 'https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>What is a Demo Account</h2>
<p>A demo account is a virtual trading account with simulated money that fully imitates real trading. You trade on real quotes using the same tools and platforms but without the risk of losing actual money. It is the ideal environment for learning and testing.</p>

<h2>Advantages for Beginners</h2>
<p>For newcomers, a demo account is a safe sandbox. Here you can master the trading platform interface, learn to open and close positions, and set stop-losses and take-profits. Mistakes on a demo account cost nothing but provide invaluable experience.</p>

<h2>Strategy Testing</h2>
<p>Even experienced traders use demo accounts for testing new strategies. Before risking real money, ensure your strategy works in current market conditions. Conduct at least 50-100 trades on demo to obtain statistically significant results.</p>

<h2>Psychological Aspect</h2>
<p>The one thing a demo account cannot teach is managing emotions when trading with real money. When real funds are at stake, fear and greed intensify dramatically. Therefore, transitioning to a real account should start with minimal amounts.</p>

<h2>How to Use Demo Effectively</h2>
<p>Treat your demo account seriously. Set the virtual deposit size equal to what you plan to start real trading with. Follow your trading plan just as strictly as in real trading. Keep a trade journal and analyze results.</p>

<h2>When to Switch to Real</h2>
<p>Transition to real trading when you achieve stable results on demo over 2-3 months. You should have a clear trading plan, understanding of risk management, and positive trade statistics.</p>'
WHERE slug = 'article-14-en';

UPDATE blog_posts SET
  title = 'Margin Trading: Opportunities and Pitfalls',
  excerpt = 'Understanding how margin trading works, leverage mechanics, and the risks of trading with borrowed funds.',
  category = 'Education',
  tags = ARRAY['margin', 'leverage', 'risks', 'margin call'],
  reading_time = 8,
  author = 'Sergei Nikolaev',
  image_url = 'https://images.pexels.com/photos/6770775/pexels-photo-6770775.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>How Margin Trading Works</h2>
<p>Margin trading allows opening positions significantly exceeding your deposit. The broker provides leverage — a type of loan that increases your buying power. With 1:100 leverage and a $1,000 deposit, you can control a $100,000 position.</p>

<h2>How Leverage Works</h2>
<p>Leverage amplifies both profits and losses proportionally. With 1:100 leverage, a 1% price move in your favor yields 100% profit on invested funds. But an equivalent move against you leads to total deposit loss. This is the primary risk of margin trading.</p>

<h2>Margin Call and Stop Out</h2>
<p>Margin call is a warning from your broker that your margin level is approaching critical. Stop out is forced position closure when margin falls below a set level (usually 20-50%). This mechanism protects against negative balance.</p>

<h2>Choosing Leverage Size</h2>
<p>Beginners should use minimal leverage — 1:10 or 1:20. With experience, you can gradually increase, but rarely should you use leverage above 1:50. Professional traders often trade with 1:5 leverage or even without it, preferring safety over potential superprofit.</p>

<h2>Calculating Margin</h2>
<p>Required Margin = Position Size / Leverage. For a $10,000 position with 1:100 leverage, required margin is $100. Free Margin = Balance - Used Margin. Ensure free margin remains sufficient to cover potential losses.</p>

<h2>Safe Margin Trading Rules</h2>
<p>Use stop-losses on every position. Never open positions for the full available margin volume. Keep free margin reserve at minimum 50% of deposit. Avoid trading during high volatility with maximum leverage.</p>'
WHERE slug = 'article-15-en';

UPDATE blog_posts SET
  title = 'How to Read Stock Charts Properly',
  excerpt = 'Detailed guide to reading and interpreting stock charts for beginner traders.',
  category = 'Education',
  tags = ARRAY['charts', 'reading charts', 'analysis', 'beginners'],
  reading_time = 7,
  author = 'Alex Volkov',
  image_url = 'https://images.pexels.com/photos/6771178/pexels-photo-6771178.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>Chart Reading Basics</h2>
<p>A stock chart is a visual representation of an asset price change over time. The horizontal axis shows time, the vertical shows price. The ability to read charts is a fundamental skill for every trader, without which informed trading decisions are impossible.</p>

<h2>Line Chart</h2>
<p>The simplest chart type. A line connecting closing prices for each period. Suitable for a general overview of price movement but does not show intra-period fluctuations — highs, lows, and opening prices.</p>

<h2>Bar Chart</h2>
<p>Each bar shows four values: open (horizontal dash on left), close (dash on right), high (top of vertical line), and low (bottom). Bars are more informative than line charts and widely used in Western markets.</p>

<h2>Candlestick Chart</h2>
<p>The most popular chart type among traders. Each candle contains the same information as a bar but presented more visually. The colored candle body instantly shows whether price rose or fell during the period.</p>

<h2>Timeframes</h2>
<p>The same asset looks different on various timeframes. Minute charts (M1-M15) are used by scalpers. Hourly (H1-H4) by day traders. Daily (D1) and weekly (W1) by swing and position traders. Always analyze multiple timeframes for a complete picture.</p>

<h2>Trading Volume</h2>
<p>Volume shows the number of trades executed during a period. Rising volume during price movement confirms trend strength. Falling volume during price rise may foreshadow reversal. Volume is an important confirming indicator not to be ignored.</p>'
WHERE slug = 'article-16-en';

UPDATE blog_posts SET
  title = 'RSI Indicator: Trading Application Strategies',
  excerpt = 'Detailed guide to the Relative Strength Index (RSI) — setup, signal interpretation, and trading strategies.',
  category = 'Technical Analysis',
  tags = ARRAY['RSI', 'indicators', 'oscillators', 'strategies'],
  reading_time = 8,
  author = 'Dmitry Kozlov',
  image_url = 'https://images.pexels.com/photos/6770609/pexels-photo-6770609.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>What is RSI</h2>
<p>The Relative Strength Index (RSI) is an oscillator developed by J. Welles Wilder in 1978. It measures the speed and magnitude of price changes on a scale from 0 to 100 and helps identify overbought and oversold market conditions.</p>

<h2>How RSI is Calculated</h2>
<p>RSI compares average gains to average losses over a specific period (standard 14). Formula: RSI = 100 - (100 / (1 + RS)), where RS is the ratio of average gain to average loss. Values above 70 indicate overbought, below 30 — oversold conditions.</p>

<h2>Basic Strategy</h2>
<p>Classic approach: buy when RSI exits the oversold zone (crosses 30 from below), sell when exiting overbought (crosses 70 from above). This strategy works better in ranging markets.</p>

<h2>RSI Divergence</h2>
<p>Divergence is one of RSI most powerful signals. Bullish divergence: price forms a new low while RSI forms a higher low. This foreshadows upward reversal. Bearish divergence: price forms a new high while RSI forms a lower high — potential downward reversal signal.</p>

<h2>RSI in Trend Trading</h2>
<p>In a strong uptrend, RSI can remain in the overbought zone for extended periods. In this case, the 40-50 zone acts as support — a bounce from it gives a buy signal. In a downtrend, the 50-60 zone becomes resistance.</p>

<h2>Period Settings</h2>
<p>Period 14 is standard but not the only option. Period 7-9 makes RSI more sensitive, suitable for short-term trading. Period 21-25 smooths signals, suitable for long-term strategies. Experiment with settings on a demo account.</p>'
WHERE slug = 'article-17-en';

UPDATE blog_posts SET
  title = 'ETF Funds: An Alternative to Direct Investment',
  excerpt = 'Understanding ETFs — how they work, what advantages they offer, and how to choose the right fund.',
  category = 'Investments',
  tags = ARRAY['ETF', 'funds', 'investments', 'diversification'],
  reading_time = 7,
  author = 'Maria Sokolova',
  image_url = 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>What is an ETF</h2>
<p>An ETF (Exchange-Traded Fund) is an investment fund whose shares trade on an exchange like regular stocks. ETFs pool funds from many investors and invest them in a basket of assets — stocks, bonds, commodities, or cryptocurrencies — according to a specific strategy or index.</p>

<h2>Advantages of ETFs</h2>
<p>The main advantage is instant diversification. By purchasing one S&P 500 ETF share, you invest in 500 of the largest American companies simultaneously. Other benefits: low fees (significantly lower than actively managed funds), portfolio transparency, and liquidity — buy and sell at any time during the trading session.</p>

<h2>Types of ETFs</h2>
<p>Index ETFs track market indices. Sector ETFs invest in specific industries: technology, healthcare, energy. Bond ETFs provide access to the debt market. Commodity ETFs track gold, oil, and other commodity prices. There are even cryptocurrency ETFs.</p>

<h2>How to Choose an ETF</h2>
<p>Pay attention to the fund expense ratio (TER), assets under management, index tracking accuracy, and liquidity. Large funds from well-known providers (Vanguard, iShares, SPDR) typically offer the best terms.</p>

<h2>ETF Investment Strategies</h2>
<p>The most popular strategy is regular purchases (DCA). Invest a fixed amount every month regardless of market conditions. This smooths the average purchase price and eliminates the need to time the market.</p>

<h2>ETFs vs Individual Stocks</h2>
<p>ETFs suit those who want to invest with minimal effort and risk. Individual stocks can yield higher returns but require deep analysis and active management. The optimal approach is a combination: ETFs as the portfolio core with a small allocation to promising individual stocks.</p>'
WHERE slug = 'article-18-en';

UPDATE blog_posts SET
  title = 'How to Build an Investment Portfolio from Scratch',
  excerpt = 'Step-by-step guide to creating a balanced investment portfolio for achieving financial goals.',
  category = 'Investments',
  tags = ARRAY['portfolio', 'investments', 'diversification', 'asset allocation'],
  reading_time = 9,
  author = 'Anna Petrova',
  image_url = 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>Define Goals and Horizon</h2>
<p>The first step is clearly defining why you are investing. Retirement savings, home purchase, passive income — each goal requires its own approach. Investment horizon (5, 10, 20 years) determines acceptable risk level and portfolio structure.</p>

<h2>Assess Your Risk Profile</h2>
<p>Your risk tolerance depends on age, financial situation, and psychological characteristics. Young investors with a long horizon can afford more risk. Approaching your goal requires a more conservative approach. Honestly assess how you react to a 20-30% portfolio decline.</p>

<h2>Asset Classes</h2>
<p>Stocks — high growth potential, high risk. Bonds — stable income, low risk. Real estate (via REITs) — moderate income and inflation protection. Commodities (gold) — risk hedging. Cash — liquidity and safety. Cryptocurrencies — high risk, high potential.</p>

<h2>Asset Allocation</h2>
<p>Classic rule: bond allocation percentage equals your age. A 30-year-old investor might use 70% stocks and 30% bonds. Aggressive portfolio: 80-90% stocks. Conservative: 30-40% stocks, the rest in bonds and money market instruments.</p>

<h2>Rebalancing</h2>
<p>Over time, asset proportions shift due to different returns. Rebalancing brings allocations back to target values. Conduct it quarterly or semi-annually. This is disciplining: you sell appreciated assets and buy depreciated ones.</p>

<h2>Common Mistakes</h2>
<p>Lack of diversification — putting all money in one asset. Trying to time the market — research shows even professionals cannot consistently beat the market. Emotional decisions — selling at the bottom and buying at the peak. Ignoring fees — even 1% fee difference significantly impacts long-term results.</p>'
WHERE slug = 'article-19-en';

UPDATE blog_posts SET
  title = 'Market Volatility: How to Use It to Your Advantage',
  excerpt = 'Understanding market volatility, how to measure it, and strategies for profiting from price fluctuations.',
  category = 'Strategies',
  tags = ARRAY['volatility', 'VIX', 'strategies', 'risk'],
  reading_time = 7,
  author = 'Sergei Nikolaev',
  image_url = 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=800',
  content = '<h2>What is Volatility</h2>
<p>Volatility is a statistical measure of the degree of price fluctuation. High volatility means large price movements in a short time; low volatility means relative stability. For traders, volatility represents both opportunity and risk simultaneously.</p>

<h2>How Volatility is Measured</h2>
<p>Historical volatility is calculated as the standard deviation of returns over a past period. Implied volatility (IV) is derived from options prices and reflects market expectations. The VIX index — the fear index — measures expected S&P 500 volatility for the next 30 days.</p>

<h2>What Causes Volatility</h2>
<p>Economic reports, central bank decisions, geopolitical events, corporate news, and even social media sentiment. Volatility typically increases during uncertainty and decreases in calm times. Historically, volatility tends to cluster — high volatility follows high, low follows low.</p>

<h2>Strategies for Volatile Markets</h2>
<p>Breakout trading: volatility creates strong moves at level breakouts. Straddles and strangles (options strategies): profit from strong movement in any direction. Scalping: many quick trades on short waves. Position reduction: during elevated volatility, reduce position sizes to control risk.</p>

<h2>Bollinger Bands — Volatility Indicator</h2>
<p>Bollinger Bands display standard deviation from a moving average. Band narrowing (squeeze) foreshadows sharp volatility increase. Band widening indicates high current volatility. Price moving outside the bands often signals movement continuation.</p>

<h2>Risk Management During High Volatility</h2>
<p>Widen stop-losses proportionally to volatility but reduce position size. Use ATR (Average True Range) to calculate optimal stop-loss. Avoid trading during major news releases if your strategy is not designed for it. Remember: the market can remain irrational longer than you can remain solvent.</p>'
WHERE slug = 'article-20-en';