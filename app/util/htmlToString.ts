import * as fs from "fs";
import * as path from "path";

const INPUT_DIR = "./html";
const OUTPUT_DIR = "./scripts/vscripts/pages";

function convertFile(inputPath: string, outputPath: string) {
    const html = fs.readFileSync(inputPath, "utf8");
    const parsed = html.replace(/"/g, "'");

    const nut = `// AUTO-GENERATED FROM ${path.basename(inputPath)}
::sendResponse(@"
${parsed}
");`;

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, nut, "utf8");

    console.log(`✓ ${inputPath} → ${outputPath}`);
}

function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true,
    }) as fs.Dirent[]) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(INPUT_DIR, fullPath);

        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            const outPath = path.join(
                OUTPUT_DIR,
                relPath.replace(/\.html$/, ".nut")
            );
            convertFile(fullPath, outPath);
        }
    }
}

walk(INPUT_DIR);
