import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// The Java dependency audit is opt-in (mvn -Paudit). The normal build and
// test-all stay offline: no scanner or SBOM plugin runs outside the profile.
const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pom = readFileSync(join(repo, "pom.xml"), "utf8");
const setup = readFileSync(join(repo, "docs/SETUP.md"), "utf8");

function profile(id) {
  const blocks = pom.match(/<profile>[\s\S]*?<\/profile>/g) ?? [];
  return blocks.find((b) => b.includes(`<id>${id}</id>`));
}

test("the audit plugins live only in the opt-in audit profile", () => {
  const audit = profile("audit");
  assert.ok(audit, "pom has an audit profile");
  assert.match(audit, /<artifactId>dependency-check-maven<\/artifactId>/);
  assert.match(audit, /<artifactId>cyclonedx-maven-plugin<\/artifactId>/);
  assert.match(audit, /<failBuildOnCVSS>7<\/failBuildOnCVSS>/);
  assert.doesNotMatch(audit, /<activation>/, "never switched on by default");
  const outside = pom.replace(/<!--[\s\S]*?-->/g, "").replace(/<profiles>[\s\S]*?<\/profiles>/, "");
  assert.doesNotMatch(outside, /dependency-check-maven|cyclonedx-maven-plugin|osv-scanner/);
  assert.doesNotMatch(pom, /<nvdApiKey>[^$<]/, "no NVD key written into the pom");
});

test("the audited dependency floor stays past the fixed high and critical findings", () => {
  const parent = pom.match(/<artifactId>spring-boot-starter-parent<\/artifactId>\s*<version>(\d+)\.(\d+)\.(\d+)<\/version>/);
  assert.ok(parent, "Spring Boot parent version");
  assert.ok(Number(parent[1]) > 3 || (Number(parent[1]) === 3 && Number(parent[2]) >= 5), "Spring Boot 3.5 or newer");
  const bc = pom.match(/<artifactId>bcprov-jdk18on<\/artifactId>\s*<version>1\.(\d+)<\/version>/);
  assert.ok(bc && Number(bc[1]) >= 84, "BouncyCastle 1.84 or newer");
  // Patch overrides on Boot's managed versions, each at or past the release that fixed a high or critical finding.
  const patch = (prop) => (pom.match(new RegExp(`<${prop.replace(".", "\\.")}>([^<]+)</`)) || [])[1]?.split(/[.-]/).map((n) => parseInt(n, 10));
  const atLeast = (have, want) => {
    for (let i = 0; i < want.length; i++) if ((have?.[i] ?? 0) !== want[i]) return (have?.[i] ?? 0) > want[i];
    return true;
  };
  for (const [prop, want] of [["tomcat.version", [10, 1, 58]], ["netty.version", [4, 1, 137]], ["postgresql.version", [42, 7, 12]], ["jackson-bom.version", [2, 21, 6]]]) {
    assert.ok(atLeast(patch(prop), want), `${prop} at or past ${want.join(".")}`);
  }
  // Two medium findings closed in the newcomer-gaps pass, same major line each.
  for (const [prop, want] of [["commons-lang3.version", [3, 18, 0]], ["log4j2.version", [2, 25, 5]]]) {
    assert.ok(atLeast(patch(prop), want), `${prop} at or past ${want.join(".")}`);
    assert.equal(patch(prop)[0], want[0], `${prop} stays on major ${want[0]}`);
  }
  // OpenTelemetry 1.62's OTLP sender needs OkHttp 5 (okhttp-jvm) while web3j brings OkHttp 4 in the same
  // okhttp3 package, so it is not overridden until a Boot or web3j update lines them up.
  assert.equal(patch("opentelemetry.version"), undefined, "no OpenTelemetry override beside web3j's OkHttp 4");
  assert.match(pom, /<web3j\.version>4\.12\.0<\/web3j\.version>/);
});

test("SETUP says how to run the audit with and without an NVD key", () => {
  assert.match(setup, /### Dependency audit \(optional, needs the network\)/);
  assert.match(setup, /mvn -B -Paudit -DskipTests -Ddependency-check\.skip=true verify/);
  assert.match(setup, /osv-scanner scan source -L target\/bom\.json/);
});
