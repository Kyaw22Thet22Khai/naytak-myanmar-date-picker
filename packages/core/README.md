# Naytak Calendar Core

## Overview

This package provides the core logic and data structures for the Naytak Calendar system, including Myanmar calendar calculations, Julian date conversions, and reusable calendar utilities. It is designed to be used by adapters for different frameworks (React, Vanilla JS, etc.).

## Features

- Myanmar lunar and solar calendar calculations
- Julian date conversion utilities
- Modular and extensible architecture
- TypeScript support
- Adapter-friendly design

## Installation

```bash
npm install @naytak/calendar-core
# or
yarn add @naytak/calendar-core
```

## Usage

```typescript
import { Calendar, MyanmarCalendar } from "@naytak/calendar-core";

const myanmarDate = MyanmarCalendar.fromGregorian(2026, 1, 17);
console.log(myanmarDate);
```

## API Reference

- **Calendar**: Base class for calendar operations.
- **MyanmarCalendar**: Handles Myanmar calendar calculations.
- **MMComponents**: Utility functions and types for Myanmar calendar.
- See [src/Calendar.ts](src/Calendar.ts) and [src/MyanmarCalendar.ts](src/MyanmarCalendar.ts) for more details.

## Folder Structure

- `src/` - Source code
  - `MMComponents/` - Myanmar calendar components and utilities
  - `__tests__/` - Unit tests
- `README.md` - This file
- `package.json` - Package metadata

## Testing

```bash
npm test
# or
npx vitest
```

## Contributing

Contributions are welcome! Please open issues or pull requests. Follow our coding standards and write tests for new features.

## License

MIT License. See [LICENSE](../../LICENSE) for details.

## Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for release notes.

## Contact

For questions or support, open an issue on GitHub or contact the maintainers.
