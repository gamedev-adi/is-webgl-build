const fs = require("fs");
const path = require("path");

/**
 * Validate Unity WebGL build structure (no HTML parsing).
 * Checks folder structure, required files, compression, case-sensitivity, and extras.
 * @param {string} buildFolder - Path to Unity WebGL export directory
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validateUnityBuild(buildFolder) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(buildFolder)) {
    errors.push("Build folder does not exist!");
    return { valid: false, errors, warnings };
  }

  const indexPath = path.join(buildFolder, "index.html");
  if (!fs.existsSync(indexPath)) {
    errors.push("index.html missing in root folder.");
  }

  const expectedFolders = ["Build", "TemplateData", "StreamingAssets"];
  const allFolders = fs.readdirSync(buildFolder).filter(f => 
    fs.lstatSync(path.join(buildFolder, f)).isDirectory()
  );

  expectedFolders.forEach(folder => {
    const found = allFolders.find(f => f.toLowerCase() === folder.toLowerCase());
    if (!found) {
      if (folder === "TemplateData" || folder === "StreamingAssets") {
        warnings.push(`${folder} folder missing (optional).`);
      } else {
        errors.push(`${folder} folder missing.`);
      }
    } else if (found !== folder) {
      warnings.push(`Folder "${found}" should be exactly "${folder}" (case-sensitive systems may fail).`);
    }
  });

  const buildDir = path.join(buildFolder, "Build");
  const requiredFiles = [
    "web.data",
    "web.framework.js",
    "web.wasm",
    "web.loader.js"
  ];

  const compressedExts = [".gz", ".br"];

  if (fs.existsSync(buildDir)) {
    const filesInBuild = fs.readdirSync(buildDir);
    const missingFiles = [];

    requiredFiles.forEach(file => {
      const baseExists = filesInBuild.includes(file);
      const compressedExists = compressedExts.some(ext => filesInBuild.includes(file + ext));
      if (!baseExists && !compressedExists) {
        missingFiles.push(file);
      }
    });

    if (missingFiles.length > 0) {
      errors.push("Missing Unity build files: " + missingFiles.join(", "));
    }

    filesInBuild.forEach(file => {
      const fullPath = path.join(buildDir, file);
      const stats = fs.statSync(fullPath);

      if (stats.size === 0) {
        warnings.push(`File ${file} is 0 bytes (possibly corrupted).`);
      }

      const expected = requiredFiles.find(f => file.toLowerCase().startsWith(f.toLowerCase()));
      if (!expected) {
        warnings.push(`Unexpected file found in Build folder: ${file}`);
      }
    });
  }

  const allowed = ["Build", "TemplateData", "StreamingAssets"];
  const extras = allFolders.filter(f => !allowed.includes(f));
  if (extras.length > 0) {
    warnings.push("Extra folders detected: " + extras.join(", "));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

module.exports = validateUnityBuild;
