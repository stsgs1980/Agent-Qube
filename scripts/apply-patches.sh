#!/usr/bin/env bash
# Apply local patches to node_modules (survives bun install)
# Patches live in patches/ named like <package>+<version>.patch
# Format: standard unified diff with a/ b/ path prefixes

set -e

PATCH_DIR="$(cd "$(dirname "$0")/.." && pwd)/patches"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -d "$PATCH_DIR" ]; then
  echo "[patches] no patches/ dir, skipping"
  exit 0
fi

shopt -s nullglob
for patch_file in "$PATCH_DIR"/*.patch; do
  # Parse package name + version from filename: @zai+select-element+1.2.0.patch
  filename="$(basename "$patch_file")"
  # Last + separates version
  pkg_version="${filename%.patch}"
  last_plus="${pkg_version##*+}"
  pkg_name="${pkg_version%+*}"
  # Replace + with / in package name (scoped packages: @zai+select-element → @zai/select-element)
  pkg_path="${pkg_name//+/\/}"

  pkg_dir="$PROJECT_DIR/node_modules/$pkg_path"
  if [ ! -d "$pkg_dir" ]; then
    echo "[patches] SKIP $filename — $pkg_path not installed"
    continue
  fi

  # Check if patch is already applied (look for a known added string)
  # Quick heuristic: if the AI Signature generator exists verbatim in target files, assume applied
  if grep -q "generateAiSignature" "$pkg_dir/DetailsPopover.tsx" 2>/dev/null; then
    echo "[patches] ALREADY APPLIED $filename"
    continue
  fi

  echo "[patches] applying $filename → $pkg_path"
  cd "$pkg_dir"
  if patch -p1 --forward < "$patch_file" 2>&1; then
    echo "[patches] OK $filename"
  else
    echo "[patches] FAILED $filename — may already be applied or conflict"
    # Revert partial state
    patch -p1 -R < "$patch_file" 2>/dev/null || true
  fi
  cd "$PROJECT_DIR"
done

echo "[patches] done"
