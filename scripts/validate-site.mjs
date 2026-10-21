import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const htmlFiles = readdirSync(root)
  .filter((file) => extname(file).toLowerCase() === ".html")
  .map((file) => join(root, file));
const errors = [];

function report(file, message) {
  errors.push(`${relative(root, file)}: ${message}`);
}

function checkLocalReferences(file, source, attribute, pattern) {
  for (const match of source.matchAll(pattern)) {
    const reference = match[1].split("#")[0].split("?")[0];

    if (!reference || reference.startsWith("http://") || reference.startsWith("https://") ||
        reference.startsWith("//") || reference.startsWith("data:") ||
        reference.startsWith("#") || reference.startsWith("mailto:")) {
      continue;
    }

    const target = resolve(root, reference);
    if (!existsSync(target)) {
      report(file, `missing ${attribute} "${reference}"`);
    }
  }
}

for (const file of htmlFiles) {
  const source = readFileSync(file, "utf8");

  if (!/^<!doctype html>/i.test(source.trimStart())) {
    report(file, "missing <!doctype html>");
  }
  if (!/<html[\s>]/i.test(source) || !/<\/html>/i.test(source)) {
    report(file, "missing html element");
  }
  if (!/<head[\s>]/i.test(source) || !/<\/head>/i.test(source)) {
    report(file, "missing head element");
  }
  if (!/<body[\s>]/i.test(source) || !/<\/body>/i.test(source)) {
    report(file, "missing body element");
  }

  checkLocalReferences(file, source, "src", /\bsrc=["']([^"']+)["']/gi);
  checkLocalReferences(file, source, "href", /\bhref=["']([^"']+)["']/gi);
}

for (const file of readdirSync(root)) {
  if (extname(file).toLowerCase() !== ".js") {
    continue;
  }

  const path = join(root, file);
  try {
    execFileSync(process.execPath, ["--check", path], { stdio: "pipe" });
  } catch (error) {
    report(path, `JavaScript syntax check failed\n${error.stderr?.toString().trim() ?? error}`);
  }
}

if (errors.length > 0) {
  console.error("Site validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Site validation passed for ${htmlFiles.length} HTML pages.`);
}
