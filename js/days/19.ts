import _ from "lodash";
import { parseNumsLines } from "../util";

export const run = (input: string) => {
  let blueprints = input
    .trim()
    .split("\n")
    .map((line) => {
      let id = parseInt(line.split(":")[0].split(" ")[1]);
      let recipes = line.split(":")[1].split(".");
      let outputs: any = [];
      for (let i = 0; i < 4; i++) {
        let recipe = recipes[i].trim().split(" ");
        let output = recipe[1];
        let costs: [string, number][] = [];
        costs.push([recipe[5], parseInt(recipe[4])]);
        if (recipe.length > 6)
          //costs[recipe[8]] = parseInt(recipe[7]);
          costs.push([recipe[8], parseInt(recipe[7])]);
        outputs.push({
          output,
          cost: costs,
        });
      }
      return {
        id,
        outputs,
      };
    });
  console.log(JSON.stringify(blueprints, null, 2));
  let memo: any = {};
  let recurse = (
    blueprint: typeof blueprints[0],
    resources: Record<string, number>,
    robots: Record<string, number>,
    time: number
  ): number => {
    if (time == 0) return resources.geode;
    let k = [JSON.stringify(resources), JSON.stringify(robots), time].join(",");
    let atStart = JSON.parse(JSON.stringify(resources)) as Record<
      string,
      number
    >;
    if (memo[k] === undefined) {
      Object.entries(robots).forEach((r) => {
        resources[r[0]] += r[1];
      });
      let best = recurse(blueprint, resources, robots, time - 1);
      blueprint.outputs.forEach((t: any) => {
        //   ["ore", "clay", "obsidian", "geode"].forEach((t) => {
        // let cost = blueprint.outputs[t];
        let cost = t.cost;
        for (let i = 0; i < cost.length; i++) {
          if (atStart[cost[i][0]] < cost[i][1]) return;
        }
        robots[t.output]++;
        for (let i = 0; i < cost.length; i++) {
          resources[cost[i][0]] -= cost[i][1];
        }
        best = Math.max(best, recurse(blueprint, resources, robots, time - 1));
        robots[t.output]--;
        for (let i = 0; i < cost.length; i++) {
          resources[cost[i][0]] += cost[i][1];
        }
      });
      return best;
    }
    return memo[k];
  };
  let sum1 = 0;
  for (let i = 0; i < blueprints.length; i++) {
    memo = {};
    sum1 +=
      blueprints[i].id *
      recurse(
        blueprints[i],
        { ore: 0, clay: 0, obsidian: 0, geode: 0 },
        { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        24
      );
  }
  return sum1;
};
