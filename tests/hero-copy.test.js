const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.match(
  html,
  /<h1 id="hero-title" class="hero-title-buyer">\s*MERN \/ Full Stack Developer who turns ideas into\s*<em>working products\.<\/em>\s*<\/h1>/,
  "the homepage should lead with the approved buyer-focused headline",
);
assert.match(
  html,
  /I’m Kunal Deshmukh\. Explore three public projects across MERN apps,\s*backend pipelines, and practical AI tools, with deeper case studies\s*for EcoTrace and AI Study Buddy\./,
  "the homepage should use the approved proof-grounded supporting line",
);
assert.doesNotMatch(
  html,
  /products that <em>ship\.<\/em>/,
  "the unsupported delivery implication should not remain in the hero",
);
assert.match(
  html,
  /id="contact-hero"[\s\S]*?data-contact-location="hero"[\s\S]*?href="mailto:resume-sable-phi@mail\.tin\.computer\?subject=MERN%20and%20full-stack%20role%20inquiry"/,
  "the hero should preserve the verified primary contact path",
);
assert.match(
  html,
  /href="\/Kunal-Deshmukh-Full-Stack-Developer-Resume\.pdf"[\s\S]*?download="Kunal-Deshmukh-Full-Stack-Developer-Resume\.pdf"[\s\S]*?data-resume-download/,
  "the hero should preserve the measured resume download",
);
assert.match(
  styles,
  /\.hero-title-buyer\s*{[^}]*max-width:\s*15ch;[^}]*font-size:\s*clamp\(54px, 5\.4vw, 80px\);[^}]*line-height:\s*0\.92;[^}]*}/,
  "the longer headline should retain a readable responsive measure",
);

console.log("hero copy checks passed");
