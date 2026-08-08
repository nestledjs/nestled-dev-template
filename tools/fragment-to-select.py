#!/usr/bin/env python3
"""Derive a Prisma select constant from a model's application SDK fragments.

The output is a migration aid, not an authorization decision. Review every selected
field and relation before adding the constant to application code.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import TypeAlias

Selection: TypeAlias = dict[str, "Selection | bool"]

FRAGMENT_PATTERN = re.compile(r"fragment\s+([A-Za-z_]\w*)\s+on\s+([A-Za-z_]\w*)\s*\{")
FIELD_PATTERN = re.compile(r"([A-Za-z_]\w*)\s*(?::\s*([A-Za-z_]\w*)\s*)?")
SPREAD_PATTERN = re.compile(r"\.\.\.([A-Za-z_]\w*)")
TYPESCRIPT_IDENTIFIER = re.compile(r"^[A-Za-z_$][A-Za-z0-9_$]*$")


def find_closing_token(source: str, start: int, opening: str, closing: str) -> int:
    """Return the closing-token offset for a balanced block starting at start."""
    depth = 0
    for offset in range(start, len(source)):
        if source[offset] == opening:
            depth += 1
        elif source[offset] == closing:
            depth -= 1
            if depth == 0:
                return offset
    raise ValueError(f"Unclosed {opening!r} block at offset {start}")


def parse_fragments(source: str) -> dict[str, tuple[str, str]]:
    """Return fragment name -> (GraphQL type, selection body)."""
    fragments: dict[str, tuple[str, str]] = {}
    for match in FRAGMENT_PATTERN.finditer(source):
        body_start = match.end() - 1
        body_end = find_closing_token(source, body_start, "{", "}")
        fragments[match.group(1)] = (match.group(2), source[body_start + 1 : body_end])
    return fragments


def merge_selection(target: Selection, addition: Selection) -> None:
    for field, value in addition.items():
        current = target.get(field)
        if isinstance(current, dict) and isinstance(value, dict):
            merge_selection(current, value)
        elif current is True and isinstance(value, dict):
            target[field] = value
        elif current is None:
            target[field] = value


def skip_whitespace(source: str, offset: int) -> int:
    while offset < len(source) and source[offset] in " \t\n\r,":
        offset += 1
    return offset


def parse_selection(
    body: str,
    fragments: dict[str, tuple[str, str]],
    seen: frozenset[str] = frozenset(),
) -> Selection:
    """Parse the subset of GraphQL selections used by generated SDK fragments."""
    selection: Selection = {}
    offset = 0

    while offset < len(body):
        offset = skip_whitespace(body, offset)
        if offset >= len(body):
            break

        if body.startswith("...", offset):
            spread = SPREAD_PATTERN.match(body, offset)
            if spread is None:
                offset += 3
                continue
            fragment_name = spread.group(1)
            if fragment_name in fragments and fragment_name not in seen:
                _, fragment_body = fragments[fragment_name]
                merge_selection(
                    selection,
                    parse_selection(fragment_body, fragments, seen | {fragment_name}),
                )
            offset = spread.end()
            continue

        field_match = FIELD_PATTERN.match(body, offset)
        if field_match is None:
            offset += 1
            continue

        field_name = field_match.group(2) or field_match.group(1)
        offset = skip_whitespace(body, field_match.end())

        if offset < len(body) and body[offset] == "(":
            offset = find_closing_token(body, offset, "(", ")") + 1
            offset = skip_whitespace(body, offset)

        if offset < len(body) and body[offset] == "{":
            relation_end = find_closing_token(body, offset, "{", "}")
            nested = parse_selection(body[offset + 1 : relation_end], fragments, seen)
            merge_selection(selection, {field_name: nested})
            offset = relation_end + 1
        elif field_name != "__typename":
            selection.setdefault(field_name, True)

    return selection


def render_selection(selection: Selection, indent: int = 2) -> str:
    padding = " " * indent
    lines: list[str] = []
    for field, value in selection.items():
        if value is True:
            lines.append(f"{padding}{field}: true,")
            continue
        if not isinstance(value, dict):
            continue
        lines.extend(
            [
                f"{padding}{field}: {{",
                f"{padding}  select: {{",
                render_selection(value, indent + 4),
                f"{padding}  }},",
                f"{padding}}},",
            ]
        )
    return "\n".join(lines)


def default_select_name(model_folder: str) -> str:
    return f"{model_folder.upper().replace('-', '_')}_FIELDS"


def load_fragment_source(fragment_dir: Path) -> str:
    graphql_files = sorted(fragment_dir.glob("*.graphql"))
    if not graphql_files:
        raise ValueError(f"No GraphQL documents found in {fragment_dir}")
    return "\n".join(path.read_text(encoding="utf-8") for path in graphql_files)


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Derive a Prisma select constant from application SDK fragments."
    )
    parser.add_argument("repo", type=Path, help="Repository root")
    parser.add_argument("model_folder", help="Folder under libs/shared/sdk/src/graphql")
    parser.add_argument("select_name", nargs="?", help="Optional TypeScript constant name")
    return parser


def main() -> None:
    args = build_argument_parser().parse_args()
    select_name = args.select_name or default_select_name(args.model_folder)
    if TYPESCRIPT_IDENTIFIER.fullmatch(select_name) is None:
        raise SystemExit(f"Invalid TypeScript identifier: {select_name}")

    fragment_dir = args.repo / "libs/shared/sdk/src/graphql" / args.model_folder
    if not fragment_dir.is_dir():
        raise SystemExit(f"No SDK document directory for {args.model_folder}: {fragment_dir}")

    try:
        fragments = parse_fragments(load_fragment_source(fragment_dir))
    except ValueError as error:
        raise SystemExit(str(error)) from error
    if not fragments:
        raise SystemExit(f"No fragments found in {fragment_dir}")

    combined: Selection = {}
    for fragment_name, (_, body) in fragments.items():
        merge_selection(combined, parse_selection(body, fragments, frozenset({fragment_name})))

    print(f"// Derived from the union of: {', '.join(sorted(fragments))}")
    print("// Review every field and relation before use; requested does not mean authorized.")
    print("// Regenerate with tools/fragment-to-select.py after any fragment change.")
    print(f"const {select_name} = {{")
    print(render_selection(combined))
    print("} as const")


if __name__ == "__main__":
    main()
