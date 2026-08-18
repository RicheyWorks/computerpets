import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const G = await import(join(root, "src/lib/pets/genetics.ts"));

const actionsSrc = readFileSync(join(root, "src/lib/pets/actions.ts"), "utf8");
const hatchSrc = readFileSync(join(root, "src/routes/hatch.tsx"), "utf8");
const nestSrc = readFileSync(join(root, "src/routes/nest.tsx"), "utf8");
const catalogSrc = readFileSync(join(root, "src/lib/pets/catalog.ts"), "utf8");

test("AA × aa → all Aa", () => {
  const square = G.punnettMono(G.EYES, ["A", "A"], ["a", "a"]);
  assert.deepEqual(square.genotypeCounts, { Aa: 4 });
  assert.equal(square.genotypeRatio, "1 Aa");
  for (const row of square.cells) {
    for (const cell of row) {
      assert.equal(G.formatDiploid(cell.genotype), "Aa");
      assert.equal(G.lookOf(G.EYES, cell.genotype), "frost");
    }
  }
});

test("Aa × Aa → 1:2:1 genotypes; 3:1 pheno when complete dominance", () => {
  const eyes = G.punnettMono(G.EYES, ["A", "a"], ["A", "a"]);
  assert.equal(eyes.genotypeCounts.AA, 1);
  assert.equal(eyes.genotypeCounts.Aa, 2);
  assert.equal(eyes.genotypeCounts.aa, 1);
  assert.equal(eyes.phenotypeCounts.amber, 1);
  assert.equal(eyes.phenotypeCounts.frost, 2);
  assert.equal(eyes.phenotypeCounts.ink, 1);

  const band = G.punnettMono(G.BAND, ["B", "b"], ["B", "b"]);
  assert.equal(band.genotypeCounts.BB, 1);
  assert.equal(band.genotypeCounts.Bb, 2);
  assert.equal(band.genotypeCounts.bb, 1);
  assert.equal(band.phenotypeCounts.banded, 3);
  assert.equal(band.phenotypeCounts.clear, 1);
  assert.equal(band.phenotypeRatio, "3 banded : 1 clear");
});

test("a recessive can hide and reappear", () => {
  const hide = G.punnettMono(G.BAND, ["B", "B"], ["b", "b"]);
  assert.deepEqual(hide.genotypeCounts, { Bb: 4 });
  assert.equal(hide.phenotypeCounts.banded, 4);
  assert.equal(hide.phenotypeCounts.clear, undefined);
  const back = G.punnettMono(G.BAND, ["B", "b"], ["B", "b"]);
  assert.equal(back.phenotypeCounts.clear, 1);
  assert.ok(G.hiddenRecessive(G.BAND, ["B", "b"]) === "b");
});

test("dihybrid mark is 9:3:3:1 when both are BbMm", () => {
  const het = { band: ["B", "b"], mask: ["M", "m"] };
  assert.equal(G.isDihybridMark(het, het), true);
  const square = G.punnettDihybridMark(het, het);
  assert.equal(square.phenotypeCounts.starred, 9);
  assert.equal(square.phenotypeCounts.banded, 3);
  assert.equal(square.phenotypeCounts.masked, 3);
  assert.equal(square.phenotypeCounts.plain, 1);
});

test("dog × oyster fails; same key succeeds; offspring key stays", () => {
  const no = G.canPair("dog", "oyster");
  assert.equal(no.ok, false);
  const yes = G.canPair("dog", "dog");
  assert.equal(yes.ok, true);
  const gleam = G.canPair("photovore", "red_panda");
  assert.equal(gleam.ok, false);
  const bee = G.canPair("honeybee", "mantis");
  assert.equal(bee.ok, false);
});

test("yeast / lichen / knot have a defined path that still mints one record", () => {
  const yeast = G.canPair("yeast", null);
  assert.equal(yeast.ok, true);
  assert.equal(yeast.path.verb, "split");
  const rise = G.rollBrood("yeast", { eyes: ["A", "a"], band: ["B", "B"], mask: ["m", "m"], aura: ["s", "s"], spore: ["U", "u"] }, null, yeast.path);
  assert.equal(rise.length, 1);
  assert.deepEqual(rise[0].genotype.eyes, ["A", "a"]);

  const twoYeast = G.canPair("yeast", "yeast");
  assert.equal(twoYeast.ok, true);
  const crossed = G.rollBrood(
    "yeast",
    { eyes: ["A", "A"], band: ["B", "B"], mask: ["m", "m"], aura: ["s", "s"], spore: ["U", "U"] },
    { eyes: ["a", "a"], band: ["B", "B"], mask: ["m", "m"], aura: ["s", "s"], spore: ["u", "u"] },
    twoYeast.path,
    () => 0,
  );
  assert.equal(crossed.length, 1);
  assert.equal(crossed[0].genotype.eyes[0] + crossed[0].genotype.eyes[1], "Aa");

  const lichen = G.canPair("lichen", null);
  assert.equal(lichen.ok, true);
  assert.equal(lichen.path.verb, "share");
  assert.equal(G.rollBrood("lichen", rise[0].genotype, null, lichen.path).length, 1);

  const knot = G.canPair("nexus", null);
  assert.equal(knot.ok, true);
  assert.equal(knot.path.verb, "bud");
  assert.equal(G.rollBrood("nexus", rise[0].genotype, null, knot.path).length, 1);
});

test("Hardy–Weinberg: known house reports p, q, expected vs observed; empty does not crash", () => {
  const empty = G.hardyWeinberg(G.BAND, []);
  assert.equal(empty.n, 0);
  assert.equal(empty.equilibrium, null);
  assert.match(empty.note, /empty/i);

  const house = [
    ["B", "B"],
    ["B", "b"],
    ["B", "b"],
    ["b", "b"],
  ];
  const report = G.hardyWeinberg(G.BAND, house);
  assert.equal(report.n, 4);
  assert.ok(Math.abs(report.freq.B - 0.5) < 1e-9);
  assert.ok(Math.abs(report.freq.b - 0.5) < 1e-9);
  assert.equal(report.observed.BB, 1);
  assert.equal(report.observed.Bb, 2);
  assert.equal(report.observed.bb, 1);
  assert.ok(Math.abs(report.expected.BB - 1) < 1e-9);
  assert.ok(Math.abs(report.expected.Bb - 2) < 1e-9);
  assert.ok(Math.abs(report.expected.bb - 1) < 1e-9);
  assert.equal(report.equilibrium, true);

  const founder = G.hardyWeinberg(
    G.BAND,
    Array.from({ length: 20 }, () => /** @type {const} */ (["B", "b"])),
  );
  assert.equal(founder.equilibrium, false);
  assert.match(founder.note, /not in equilibrium/i);
});

test("catalog hatch assigns a legal genotype consistent with the shown phenotype", () => {
  for (let i = 0; i < 40; i++) {
    const key = i % 2 === 0 ? "dog" : "oyster";
    const g = G.rollCatalogGenotype(key, () => (i + 1) / 41);
    assert.equal(G.isLegalGenotype(g, key), true);
    const pheno = G.phenotypeOf(g, key);
    assert.ok(["amber", "ink", "frost", "ember"].includes(pheno.eyes));
    assert.ok(["plain", "masked", "banded", "starred"].includes(pheno.mark));
    assert.ok(["still", "dustlit", "emberlit", "moonlit"].includes(pheno.aura));
    const inferred = G.genotypeFromPhenotype(pheno, key);
    assert.deepEqual(G.phenotypeOf(inferred, key).eyes, pheno.eyes);
    assert.deepEqual(G.phenotypeOf(inferred, key).mark, pheno.mark);
    assert.deepEqual(G.phenotypeOf(inferred, key).aura, pheno.aura);
  }
});

test("the hatchery draw is still the catalog draw; nest is beside it", () => {
  assert.match(actionsSrc, /export const hatchPet/);
  assert.match(actionsSrc, /pickWeightedRarity/);
  assert.match(actionsSrc, /pickSpecies/);
  assert.match(actionsSrc, /rollCatalogGenotype/);
  assert.match(actionsSrc, /HATCH_COST\[rarity\]/);
  assert.doesNotMatch(actionsSrc, /replace that draw/);
  assert.match(hatchSrc, /Hatch/);
  assert.match(hatchSrc, /Or pair two you already keep/);
  assert.match(nestSrc, /createFileRoute\("\/nest"\)/);
  assert.match(catalogSrc, /TRAIT_POOLS/);
  assert.match(catalogSrc, /eyes: \["amber", "ink", "frost", "ember"\]/);
});

test("extinction is keeper-local and quiet", () => {
  const lines = G.extinctLines(["octopus"], [], []);
  assert.deepEqual(lines.map((l) => l.line), ["This house has no Cup."]);
  const waiting = G.extinctLines(["octopus"], [], ["octopus"]);
  assert.equal(waiting.length, 0);
  const living = G.extinctLines(["octopus"], ["octopus"], []);
  assert.equal(living.length, 0);
});

test("a clutch roll is taken from the square, not a parent-pick mix", () => {
  const path = G.nestPath("dog", 2);
  const children = G.rollBrood(
    "dog",
    { eyes: ["A", "A"], band: ["B", "B"], mask: ["m", "m"], aura: ["L", "L"] },
    { eyes: ["a", "a"], band: ["b", "b"], mask: ["m", "m"], aura: ["s", "s"] },
    path,
    () => 0.1,
  );
  assert.equal(children.length, 1);
  assert.equal(G.formatDiploid(children[0].genotype.eyes), "Aa");
  assert.equal(children[0].phenotype.eyes, "frost");
  assert.doesNotMatch(actionsSrc, /parent A or B/);
  assert.doesNotMatch(nestSrc, /Math\.random\(\) < 0\.5 \? parentA : parentB/);
});
