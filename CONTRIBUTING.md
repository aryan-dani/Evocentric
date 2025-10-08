# Contributing to Evocentric

First off, thank you for considering contributing to Evocentric! It's people like you that make Evocentric such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs** if possible
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the JavaScript/TypeScript styleguide
- Include screenshots and animated GIFs in your pull request whenever possible
- End all files with a newline
- Avoid platform-dependent code

## Development Process

### Setup Development Environment

1. Fork the repo
2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/evocentric.git
cd evocentric
```

3. Add upstream remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/evocentric.git
```

4. Install dependencies

```bash
npm install
```

5. Create a branch

```bash
git checkout -b feature/my-new-feature
```

### Development Workflow

1. Make your changes
2. Test your changes thoroughly
3. Commit your changes

```bash
git commit -m "feat: add some feature"
```

4. Push to your fork

```bash
git push origin feature/my-new-feature
```

5. Create a Pull Request

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use template literals for string interpolation
- Use arrow functions where appropriate
- Use async/await over promises
- Add comments for complex logic
- Follow React best practices

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for high code coverage
- Test on multiple browsers if making UI changes

### Documentation

- Update README.md if needed
- Update docs/ if adding new features
- Add JSDoc comments to functions
- Update CHANGELOG.md

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── lib/            # Utilities
├── assets/         # Static assets
└── ...
```

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `documentation` - Improvements or additions to documentation
- `duplicate` - This issue or pull request already exists
- `enhancement` - New feature or request
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `invalid` - This doesn't seem right
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## Questions?

Don't hesitate to ask questions in the GitHub Discussions or open an issue.

Thank you for contributing! 🎉
