# @naytak/calendar-core

This package contains the framework-agnostic core logic for Naytak Calendar. All calendar calculations, data structures, and algorithms should be implemented here, without any platform-specific code (no DOM, React, etc).

## Structure

- `src/index.ts`: Main entry point for core logic
- `tests/`: Unit tests for core logic

## Development

- Build: `npm run build -w @naytak/calendar-core`
- Dev: `npm run dev -w @naytak/calendar-core`

## Usage

Import and use in any JS-based platform via adapters (React, Vanilla JS, etc).
