Here's a comprehensive pull request template to streamline contributions and ensure consistency in pull requests for your **Performance Decorators** project. This template will guide contributors to provide necessary details about their changes, making it easier for maintainers to review and understand the context and impact of each contribution.

---

# Pull Request Template

## Description

Please include a clear and concise description of what the pull request does. Explain the problem this pull request is solving or the feature it adds to the project. Link any relevant issues or previous discussions here.

**Example:**

```
Fixes # (issue)

- Added a new performance optimization decorator that improves...
- Fixed a bug where the debounce decorator did not handle...
- Updated documentation to reflect the changes made.
```

## Type of Change

Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so reviewers can reproduce the tests. Please also list any relevant details for your test configuration.

**Example:**

```
- Ran the test suite with `npm test`.
- Added new unit tests for the LazyLoad decorator.
- Manually tested in Node.js v14 and v16.
```

### Test Configuration:

- Node.js version:
- TypeScript version:

## Checklist:

Please review the following items and ensure your pull request meets these guidelines:

- [ ] I have followed the [style guidelines](https://github.com/RyanMyrvold/Performance-Decorators/blob/main/CONTRIBUTING.md) of this project.
- [ ] I have performed a self-review of my code.
- [ ] I have commented on my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings or errors.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] New and existing unit tests pass locally with my changes.
- [ ] downstream modules have merged and published any dependent changes.

## Screenshots (if appropriate):

Optional. You can add diagrams or screenshots to help explain your pull request's changes and functionality.

## Further Comments

If you have something else you would like to add about the pull request, put that here.

**Example:**

```
- This feature significantly improves the initial load time of web applications by lazy-loading heavy computations.
- Looking forward to feedback on the retry strategy implemented in the AutoRetry decorator.
```
