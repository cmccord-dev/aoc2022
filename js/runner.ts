const lib = require("./lib");

let day =
  process.argv.length == 2 ? new Date().getDate() : parseInt(process.argv[2]!);
(async () => {
  let input = await lib.fetchInput(day);
  let runner = require(`./days/${day}.ts`);
  let start = new Date();
  let results = runner.run(input);
  let end = new Date();
  console.log(
    `Took ${(end as unknown as number) - (start as unknown as number)}`
  );
  console.log(results);
})().catch((e) => {
  console.log(e);
});
