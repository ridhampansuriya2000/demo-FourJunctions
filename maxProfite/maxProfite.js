const buildings = {
    T: { time: 5, earnings: 1500 },
    P: { time: 4, earnings: 1000 },
    C: { time: 10, earnings: 3000 }
};

function maxProfit(totalTime) {
    let maxEarnings = 0;
    const results = [];

    for (let t = 0; t * buildings.T.time <= totalTime-1; t++) {
        for (let p = 0; p * buildings.P.time + t * buildings.T.time <= totalTime-1; p++) {
            for (let c = 0; c * buildings.C.time + p * buildings.P.time + t * buildings.T.time <= totalTime-1; c++) {

                const totalUsedTime = t * buildings.T.time + p * buildings.P.time + c * buildings.C.time;
                if (totalUsedTime > totalTime) continue;

                let timeCursor = 0;
                let earning = 0;

                for (let i = 0; i < t; i++) {
                    timeCursor += buildings.T.time;
                    if (timeCursor > totalTime) break;
                    earning += (totalTime - timeCursor) * buildings.T.earnings;
                }

                for (let i = 0; i < p; i++) {
                    timeCursor += buildings.P.time;
                    if (timeCursor > totalTime) break;
                    earning += (totalTime - timeCursor) * buildings.P.earnings;
                }

                for (let i = 0; i < c; i++) {
                    timeCursor += buildings.C.time;
                    if (timeCursor > totalTime) break;
                    earning += (totalTime - timeCursor) * buildings.C.earnings;
                }

                if (earning > maxEarnings) {
                    maxEarnings = earning;
                    results.length = 0;
                    results.push({ T: t, P: p, C: c });
                } else if (earning === maxEarnings) {
                    results.push({ T: t, P: p, C: c });
                }
            }
        }
    }

    return {
        maxEarnings,
        possibilities: results
    };
}

const testExample = [7, 8, 13, 19, 20];

testExample.forEach(time => {
    const result = maxProfit(time);
    console.log(`Test result fro :${time}`, result);
});

/** Explanation
 -  we have total 3 buildings so first we try to every possible pairs which total time should less or equal to given time minus one unit ( we minus one unit because if its  equal then which bulidng is build in last it's not event start earnig)
 -  by using 3 nested for loop we try to make every possible pairs
 for example : when t & p is equal to 0 => c+c, c+c+c, c+c+c+c, c+c+c+c ..... when total time grater then given time minus one unit we stop that loop and move to parent loop p
 -  for now scenario is : when t is equal to 0 & p equal to 1 => p+c, p+c+c, p+c+c+c, p+c+c+c+c,
 -  This continues for all valid combinations of T, P, and C.
 When `t = 1` and `p = 0`, we try: `t`, `t+c`, `t+c+c`, `t+c+c+c`, ... until total time > n.
 When `t = 1` and `p = 1`, we try: `t+p`, `t+p+c`, `t+p+c+c`, ... and so on.
 When `t = 2` and `p = 0`, we try: `t+t`, `t+t+c`, `t+t+c+c`, ... until time exceeds limit.
 When `t = 2` and `p = 2`, we try: `t+t+p+p`, `t+t+p+p+c`, `t+t+p+p+c+c`, ...
 When `t = 3` and `p = 1`, we try: `t+t+t+p`, `t+t+t+p+c`, `t+t+t+p+c+c`, ...

 - For every valid combination, we simulate building them sequentially.
 - Each building starts earning only after it's built.

 - If this combination’s total earnings is greater than current maxEarnings,
 - We update maxEarnings
 - And reset the results array to store only this combination.

 - If this combination earns the same as current maxEarnings,
 - We add it to the results array (multiple best combinations are allowed).

 - Note: We filter out combinations where the last building would have no time left to earn.


 */
