function maxProfit(n) {
    const buildings = {
        T: { time: 5, earnings: 1500 },
        P: { time: 4, earnings: 1000 },
        C: { time: 10, earnings: 3000 }
    };

    let maxEarnings = 0;
    let results = new Set();

    for (let t = 0; t * buildings.T.time <= n; t++) {
        for (let p = 0; p * buildings.P.time + t * buildings.T.time <= n; p++) {
            for (let c = 0; c * buildings.C.time + p * buildings.P.time + t * buildings.T.time <= n; c++) {
                const totalTime = t * buildings.T.time + p * buildings.P.time + c * buildings.C.time;

                if (totalTime <= n) {
                    const earnings = t * buildings.T.earnings + p * buildings.P.earnings + c * buildings.C.earnings;

                    const combo = { T: t, P: p, C: c };
                    const comboStr = JSON.stringify(combo);

                    if (earnings > maxEarnings) {
                        maxEarnings = earnings;
                        results.clear();
                        results.add(comboStr);
                    } else if (earnings === maxEarnings) {
                        results.add(comboStr);
                    }
                }
            }
        }
    }

    return {
        earnings: maxEarnings,
        solutions: Array.from(results).map(str => JSON.parse(str))
    };
}

const testExample = [7, 8, 13, 19, 20];

testExample.forEach(time => {
    const result = maxProfit(time);
    console.log(`Test result fro :${time}`, result);
});

/** Explanation
 -  we have total 3 buildings so first we try to every possible pairs which total time should less or equal to given time
 -  by using 3 nested for loop we try to make every possible pairs
    for example : when t & p is equal to 0 => c+c, c+c+c, c+c+c+c, c+c+c+c ..... when total time grater then given time we stop that loop and move to parent loop p
 -  for now scenario is : when t is equal to 0 & p equal to 1 => p+c, p+c+c, p+c+c+c, p+c+c+c+c,
 -  This continues for all valid combinations of T, P, and C.
    When `t = 1` and `p = 0`, we try: `t`, `t+c`, `t+c+c`, `t+c+c+c`, ... until total time > n.
    When `t = 1` and `p = 1`, we try: `t+p`, `t+p+c`, `t+p+c+c`, ... and so on.
    When `t = 2` and `p = 0`, we try: `t+t`, `t+t+c`, `t+t+c+c`, ... until time exceeds limit.
    When `t = 2` and `p = 2`, we try: `t+t+p+p`, `t+t+p+p+c`, `t+t+p+p+c+c`, ...
    When `t = 3` and `p = 1`, we try: `t+t+t+p`, `t+t+t+p+c`, `t+t+t+p+c+c`, ...

 -  If the earnings equal the current max, we simply add the current combination to the `results` set.
 -  We use a `Set` to **store unique combinations only**, avoiding duplicates.
 -  when we get new maxEarning value remove previous all pairs


 */
