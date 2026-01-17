# Naytak Calendar Monorepo

A modular, extensible calendar system with support for the Myanmar calendar and adapters for multiple frameworks.

## Packages

- **core**: Core logic and data structures for calendar calculations ([packages/core](packages/core))
- **calendar-system**: Shared calendar system utilities ([packages/calendar-system](packages/calendar-system))
- **adapter-react**: React components and integration ([packages/adapter-react](packages/adapter-react))
- **adapter-vanilla**: Vanilla JS integration ([packages/adapter-vanilla](packages/adapter-vanilla))

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Build all packages**

   ```bash
   npm run build
   ```

3. **Run tests**

   ```bash
   npm test
   ```

## Monorepo Structure

```
packages/
  core/              # Core calendar logic
  calendar-system/   # Shared calendar utilities
  adapter-react/     # React adapter and demo
  adapter-vanilla/   # Vanilla JS adapter
```

## Development

- Each package contains its own README with usage and development details.
- Use workspace commands to build or test all packages at once.

## Contributing

Contributions are welcome! Please open issues or pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) if available.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contact

For questions or support, open an issue on GitHub or contact the maintainers.
